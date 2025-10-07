import { v4 as uuidv4 } from "uuid";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { auth } from "@/app/lib/auth";
import { Question } from "@/lib/models/qModels";

interface AddQuestionRequest {
  title: string;
  description?: string;
  images?: string[];
  isAnonymous: boolean;
}

export async function POST(req: Request) {
  try {
    const {
      title,
      description = "",
      images = [],
      isAnonymous,
    }: AddQuestionRequest = await req.json();

    console.log("Received images:", images);

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

    const newQuestion = {
      id: uuidv4(),
      title: title.trim(),
      description: description?.toString() || "",
      asker: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
      isAnonymous,
      images,
      views: 0,
      answers: [],
    };

    console.log("newQuestion object:", newQuestion);

    const questionDoc = await Question.create(newQuestion);

    return NextResponse.json(
      {
        success: true,
        message: "question added successfully",
        question: questionDoc,
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
