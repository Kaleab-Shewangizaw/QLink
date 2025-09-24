import { auth } from "@/app/lib/auth";
import { Answer, Question } from "@/lib/models/qModels";
import dbConnect from "@/lib/mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

interface UpdateQuestionInterface {
  title: string;
  description?: string;
  isAnonymous: boolean;
  likes?: number;
  views?: number;
  upVotes?: string[];
  downVotes?: string[];
  answers?: Answer[];
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const {
    title,
    description,
    isAnonymous,
    upVotes,
    downVotes,
    views,
    answers,
  }: UpdateQuestionInterface = await req.json();

  try {
    await dbConnect();

    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const question = await Question.findByIdAndUpdate(
      id,
      {
        title,
        description,
        isAnonymous,
        upVotes,
        downVotes,
        views,
        answers,
      },
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
