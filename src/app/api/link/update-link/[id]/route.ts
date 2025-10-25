import { auth } from "@/app/lib/auth";
import { Link } from "@/lib/models/LinkModel";

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
      return NextResponse.json(
        { message: "Log in required." },
        { status: 401 }
      );
    }

    const body = await req.json();

    if (body.question) {
      body.question.respondent = session.user.id;

      const link = await Link.findByIdAndUpdate(
        id,
        { $push: { questions: body.question } },
        { new: true }
      );

      if (!link) {
        return NextResponse.json(
          { success: false, message: "Link not found" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true, message: "Question added successfully", link },
        { status: 200 }
      );
    }

    const { name, isOpen } = body;

    const link = await Link.findByIdAndUpdate(
      id,
      { name, isOpen },
      { new: true }
    );

    if (!link) {
      return NextResponse.json(
        { success: false, message: "Link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "Link updated successfully", link },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating link:", error);
    return NextResponse.json(
      { success: false, message: "Error updating link" },
      { status: 500 }
    );
  }
}
