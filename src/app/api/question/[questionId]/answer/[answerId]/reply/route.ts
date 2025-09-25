import { auth } from "@/app/lib/auth";
import { Question } from "@/lib/models/qModels";
import dbConnect from "@/lib/mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function POST(
  req: Request,
  { params }: { params: { questionId: string; answerId: string } }
) {
  const { questionId, answerId } = params;

  try {
    await dbConnect();

    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    if (!session?.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const text = (body.text || "").toString();
    if (!text.trim()) {
      return NextResponse.json(
        { success: false, message: "Reply text required" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(questionId)) {
      return NextResponse.json(
        { success: false, message: "Invalid questionId" },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(answerId)) {
      return NextResponse.json(
        { success: false, message: "Invalid answerId" },
        { status: 400 }
      );
    }

    // Build reply object
    const reply = {
      id: new mongoose.Types.ObjectId(),
      text,
      respondent: session.user.id,
      upVotes: [],
      downVotes: [],
      isReply: true,
      replies: 0,
      questionId: new mongoose.Types.ObjectId(questionId),
      repliedTo: new mongoose.Types.ObjectId(answerId),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Update: find question and parent answer, then push reply
    const question = await Question.findOneAndUpdate(
      { _id: questionId, "answers.id": answerId },
      {
        $push: { answers: reply },
        $inc: { "answers.$.replies": 1 },
      },
      { new: true }
    );

    if (!question) {
      return NextResponse.json(
        { success: false, message: "Question or answer not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, question }, { status: 200 });
  } catch (error) {
    console.error("Error adding reply:", error);
    return NextResponse.json(
      { success: false, message: "Error adding reply" },
      { status: 500 }
    );
  }
}
