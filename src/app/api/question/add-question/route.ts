import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { auth } from "@/app/lib/auth";
import { IQuestion, Question } from "@/lib/models/qModels";

interface AddQuestionRequest {
  title: string;
  description?: string;
  isAnonymous: boolean;

  teamId?: string;
}

export async function POST(req: Request) {
  try {
    const {
      title,
      description = "",
      isAnonymous,
    }: AddQuestionRequest = await req.json();

    if (title.trim().length === 0) {
      return NextResponse.json(
        { message: "Question title must be a non-empty string" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Get headers once and reuse them
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Create new question
    const newQuestion: IQuestion = {
      id: uuidv4(),
      title: title.trim(),
      description: description?.toString() || "",
      asker: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAnonymous,
      likes: 0,
      views: 0,
      answers: [],
    };

    await Question.create(newQuestion);

    return NextResponse.json(
      {
        success: true,
        message: "question added successfully",
        question: newQuestion,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error adding question:", err);
    return NextResponse.json(
      {
        message: "Failed to add question",
        error: err instanceof Error ? err.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
