import { Question } from "@/lib/models/qModels";
import dbConnect from "@/lib/mongodb";

export async function GET(req: Request, res: Response) {
  try {
    await dbConnect();
    const questions = await Question.find().sort({ createdAt: -1 });
    return new Response(JSON.stringify({ success: true, questions }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error fetching questions:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error fetching questions" }),
      { status: 500 }
    );
  }
}
