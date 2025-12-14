import { headers } from "next/headers";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { auth } from "@/app/lib/auth";
import { Question } from "@/lib/models/qModels";

export async function GET() {
  try {
    await dbConnect();

    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Find questions where the user has answered
    // We look for questions where the answers array contains an element with respondent.id matching the user's id
    const answeredQuestions = await Question.find({
      "answers.respondent.id": session.user.id,
    }).sort({
      updatedAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        questions: answeredQuestions,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
