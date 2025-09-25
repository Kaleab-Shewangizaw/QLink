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

    if (body.answers && body.answers.length > 0) {
      const newAnswer = body.answers[body.answers.length - 1];
      newAnswer.respondent = session.user.id;

      const question = await Question.findByIdAndUpdate(
        id,
        { $push: { answers: newAnswer } },
        { new: true }
      );

      if (!question) {
        return NextResponse.json(
          { success: false, message: "Question not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, message: "Answer added successfully", question },
        { status: 200 }
      );
    }

    const { title, description, isAnonymous, upVotes, downVotes, views } = body;

    const question = await Question.findByIdAndUpdate(
      id,
      { title, description, isAnonymous, upVotes, downVotes, views },
      { new: true }
    );

    if (!question) {
      return NextResponse.json(
        { success: false, message: "Question not found" },
        { status: 404 }
      );
    }

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
