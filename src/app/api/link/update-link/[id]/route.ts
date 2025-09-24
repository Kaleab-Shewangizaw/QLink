import { auth } from "@/app/lib/auth";
import { Link } from "@/lib/models/LinkModel";
import { Answer } from "@/lib/models/qModels";
import dbConnect from "@/lib/mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

interface UpdateLinkInterface {
  name?: string;
  questions?: Answer[];
  isOpen?: boolean;
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const { name, questions, isOpen }: UpdateLinkInterface = await req.json();

  try {
    await dbConnect();

    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const link = await Link.findByIdAndUpdate(
      id,
      {
        name,
        questions,
        isOpen,
      },
      { new: true }
    );

    if (!link) {
      return NextResponse.json(
        { success: false, message: "link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "link updated successfully", link },
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
