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

    const link = await Link.findById(id);

    if (!link) {
      return NextResponse.json(
        { success: false, message: "Link not found" },
        { status: 404 }
      );
    }

    if (body.question) {
      body.question.respondent = session.user.id;

      link.questions.push(body.question);
      await link.save();

      return NextResponse.json(
        { success: true, message: "Question added successfully", link },
        { status: 200 }
      );
    }

    const { name, isOpen } = body;

    if (name !== undefined || isOpen !== undefined) {
      if (link.owner.id !== session.user.id) {
        return NextResponse.json(
          { message: "Only the owner can update link details" },
          { status: 403 }
        );
      }

      if (name) link.name = name;
      if (isOpen !== undefined) link.isOpen = isOpen;

      await link.save();

      return NextResponse.json(
        { success: true, message: "Link updated successfully", link },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: true, message: "No changes made", link },
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
