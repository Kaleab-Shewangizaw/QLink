import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

const uri = process.env.MONGODB_URI!;
const client = new MongoClient(uri);
const dbName = process.env.MONGODB_DB || "test";

export async function DELETE() {
  try {
    const headersList = await headers();
    const session = await auth.api.getSession({ headers: headersList });
    const id = session?.user?.id;

    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    await client.connect();
    const db = client.db(dbName);
    const users = db.collection("user");

    const result = await users.findOneAndDelete({ _id: new ObjectId(id) });

    if (!result) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        message: "User deleted successfully",
        user: result.value,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
