import { auth } from "@/app/lib/auth";
import { Question } from "@/lib/models/qModels";
import dbConnect from "@/lib/mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await dbConnect();

    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    const question = await Question.findById(id);

    if (!question) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

    if (body.deleteAnswerId) {
      const answer = question.answers.find(
        (a: any) => a._id.toString() === body.deleteAnswerId
      );

      if (!answer) {
        return NextResponse.json(
          { success: false, message: "Answer not found" },
          { status: 404 }
        );
      }

      const isAsker = question.asker.id === session.user.id;
      const isRespondent = answer.respondent?.id === session.user.id;

      if (!isAsker && !isRespondent) {
        return NextResponse.json(
          { message: "Unauthorized to delete this answer" },
          { status: 403 }
        );
      }

      question.answers = question.answers.filter(
        (a: any) => a._id.toString() !== body.deleteAnswerId
      );
      await question.save();

      return NextResponse.json(
        { success: true, message: "Answer deleted successfully", question },
        { status: 200 }
      );
    }

    if (body.answers && body.answers.length > 0) {
      const newAnswer = body.answers[body.answers.length - 1];
      newAnswer.respondent = {
        id: session.user.id,
        name: session.user.name || "Anonymous",
        email: session.user.email || "",
        image: session.user.image || "",
      };
      // Ensure isAnonymous is preserved from the request body
      // It should already be in newAnswer if passed from frontend, but let's be explicit if needed.
      // The frontend sends the whole answer object in the array, so newAnswer has it.

      question.answers.push(newAnswer);
      await question.save();

      return NextResponse.json(
        { success: true, message: "Answer added successfully", question },
        { status: 200 }
      );
    }

    const { title, description, isAnonymous, upVotes, downVotes, views } = body;

    // Check if sensitive fields are being updated
    if (
      title !== undefined ||
      description !== undefined ||
      isAnonymous !== undefined
    ) {
      if (question.asker.id !== session.user.id) {
        return NextResponse.json(
          { message: "Only the asker can update question details" },
          { status: 403 }
        );
      }
      if (title) question.title = title;
      if (description) question.description = description;
      if (isAnonymous !== undefined) question.isAnonymous = isAnonymous;
    }

    // Allow votes and views updates by authenticated users
    if (upVotes) question.upVotes = upVotes;
    if (downVotes) question.downVotes = downVotes;
    if (views) question.views = views;

    await question.save();

    return NextResponse.json(
      { success: true, message: "Question updated successfully", question },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating question:", error);
    return NextResponse.json(
      { success: false, message: "Error updating question" },
      { status: 500 }
    );
  }
}
