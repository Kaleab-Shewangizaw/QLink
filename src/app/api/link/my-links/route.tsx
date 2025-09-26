import { headers } from "next/headers";
import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { auth } from "@/app/lib/auth";
import { Link } from "@/lib/models/LinkModel";

export async function GET() {
  try {
    await dbConnect();

    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });

    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const userLinks = await Link.find({ owner: session.user.id }).sort({
      createdAt: -1,
    });

    return NextResponse.json(
      {
        success: true,
        links: userLinks,
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
