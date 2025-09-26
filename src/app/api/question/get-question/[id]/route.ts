import { Question } from "@/lib/models/qModels";
import dbConnect from "@/lib/mongodb";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, message: "Question ID is required" }),
      { status: 400 }
    );
  }

  try {
    await dbConnect();
    const question = await Question.findById(id);

    if (!question) {
      return new Response(
        JSON.stringify({ success: false, message: "Question not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ success: true, question }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching question:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching question" }),
      { status: 500 }
    );
  }
}
