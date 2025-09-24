import { auth } from "@/app/lib/auth";
import { Link } from "@/lib/models/LinkModel";
import dbConnect from "@/lib/mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  try {
    await dbConnect();

    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const link = await Link.findOneAndDelete({ _id: id });

    if (!link) {
      return NextResponse.json(
        { success: false, message: "link not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, message: "link deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting link:", error);
    return NextResponse.json(
      { success: false, message: "Error updating link" },
      { status: 500 }
    );
  }
}
