import { auth } from "@/app/lib/auth";
import { Link } from "@/lib/models/LinkModel";
import dbConnect from "@/lib/mongodb";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { name } = await req.json();
    if (name.trim().length === 0) {
      return NextResponse.json(
        { message: "Link name must be a non-empty string" },
        { status: 400 }
      );
    }
    await dbConnect();
    const heradersList = await headers();
    const session = await auth.api.getSession({ headers: heradersList });

    if (!session?.user) {
      return NextResponse.json({ message: "Login required." }, { status: 401 });
    }

    const newLink = {
      name: name.trim(),
      owner: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const createdLink = await Link.create(newLink);

    return NextResponse.json(
      {
        success: true,
        message: "Link added successfully",
        link: createdLink,
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error", error },
      { status: 500 }
    );
  }
}
