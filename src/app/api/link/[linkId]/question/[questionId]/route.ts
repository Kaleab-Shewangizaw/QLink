import { auth } from "@/app/lib/auth";
import { Link } from "@/lib/models/LinkModel";
import dbConnect from "@/lib/mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  context: { params: Promise<{ linkId: string; questionId: string }> }
) {
  const { linkId, questionId } = await context.params;

  try {
    await dbConnect();

    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { upVotes, downVotes } = await req.json();

    const link = await Link.findOneAndUpdate(
      { _id: linkId, "questions._id": questionId },
      {
        $set: {
          "questions.$.upVotes": upVotes,
          "questions.$.downVotes": downVotes,
        },
      },
      { new: true }
    );

    if (!link) {
      return NextResponse.json(
        { success: false, message: "Link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Link votes updated", link },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating link votes:", error);
    return NextResponse.json(
      { success: false, message: "Error updating link votes" },
      { status: 500 }
    );
  }
}
