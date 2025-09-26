import { auth } from "@/app/lib/auth";
import { Question } from "@/lib/models/qModels";
import dbConnect from "@/lib/mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: { questionId: string; answerId: string } }
) {
  const { questionId, answerId } = context.params;

  try {
    await dbConnect();

    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { upVotes, downVotes } = await req.json();

    const question = await Question.findOneAndUpdate(
      { _id: questionId, "answers._id": answerId },
      {
        $set: {
          "answers.$.upVotes": upVotes,
          "answers.$.downVotes": downVotes,
        },
      },
      { new: true }
    );

    if (!question) {
      return NextResponse.json(
        { success: false, message: "Answer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Answer votes updated", question },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating answer votes:", error);
    return NextResponse.json(
      { success: false, message: "Error updating answer votes" },
      { status: 500 }
    );
  }
}
