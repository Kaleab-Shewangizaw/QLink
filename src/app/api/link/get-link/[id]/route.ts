import { Link } from "@/lib/models/LinkModel";
import dbConnect from "@/lib/mongodb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, message: "link ID is required" }),
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const link = await Link.findById(id);

    if (!link) {
      return new Response(
        JSON.stringify({ success: false, message: "link not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, link }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching link:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching link" }),
      { status: 500 }
    );
  }
}
