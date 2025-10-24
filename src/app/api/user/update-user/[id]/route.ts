import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = process.env.MONGODB_DB || "test";

export async function PUT(req: Request) {
  try {
    const { name, image }: { name?: string; image?: string } = await req.json();

    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    const id = session?.user?.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("user");

    const result = await users.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { name, image } },
      { returnDocument: "after" }
    );

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        user: result.value,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
