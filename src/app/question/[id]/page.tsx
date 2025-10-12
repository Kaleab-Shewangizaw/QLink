"use client";

import { authClient } from "@/app/lib/auth-client";
import AnswerComp from "@/comp/answerComp";
import { Bottom, Top } from "@/comp/questionComp";
import { QuestionPageSkeleton } from "@/comp/questionPageSkeleton";
import QuestionImages from "@/comp/qustionImages";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Answer, IQuestion } from "@/lib/models/qModels";
import { ArrowLeft, TrashIcon } from "lucide-react";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuestionPage() {
  const [open, setOpen] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const [data, setData] = useState<IQuestion | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [newAnswer, setNewAnswer] = useState("");
  const router = useRouter();
  const params = useParams();
  const questionId = params.id as string;
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/question/get-question/${questionId}`);
        const data = await res.json();
        setData(data.question);
        setAnswers(data.question.answers || []);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    if (questionId) fetchQuestion();
  }, [questionId]);

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    try {
      const res = await fetch(`/api/question/delete-question/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.push("/");
      } else {
        console.error("Failed to delete question");
      }
    } catch (error) {
      console.error("Error deleting question:", error);
    }
  };

  const handleAddAnswer = async () => {
    if (!newAnswer.trim()) return;

    const newAnswerObj: Answer = {
      text: newAnswer,
      upVotes: [],
      downVotes: [],
      isReply: false,
      replies: 0,
      questionId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const res = await fetch(`/api/question/update-question/${questionId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          answers: [...answers, newAnswerObj],
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setAnswers(data.question.answers);
        setNewAnswer("");
        setOpen(false);
      } else {
        console.error("Failed to add answer");
      }
    } catch (error) {
      console.error("Error adding answer:", error);
    }
  };

  return (
    <div className="px-2 pb-5 flex flex-col">
      <div className="sticky top-13 z-10 bg-white dark:bg-[#0a0a0a] p-2 left-0 border border-gray-700 border-b-0 text-gray-500 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="hover:text-gray-300 cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft /> Back
        </button>
        <div className="flex items-center gap-2">
          {userId === data?.asker.id && (
            <Button
              variant={"outline"}
              className="text-red-400"
              onClick={() => {
                if (confirm("Are you sure you want to delete this question?"))
                  handleDelete(data?._id);
              }}
            >
              <TrashIcon /> Delete
            </Button>
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Answer</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle className="text-sm text-gray-400 font-normal">
                  Answer
                </DialogTitle>
                <DialogDescription className="text-lg font-semibold line-clamp-3 text-gray-500">
                  {data?.title}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <Textarea
                  id="answer"
                  name="answer"
                  className="w-full"
                  rows={10}
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  onKeyDown={(e) =>
                    e.key === "Enter" && !e.shiftKey && handleAddAnswer()
                  }
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddAnswer}>Answer</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {data ? (
        <div>
          <div className="border border-gray-700 p-4 rounded-b-none border-y-0">
            <Top question={data} />
            <h1 className="text-lg font-semibold">{data.title}</h1>
            <p
              className={`text-gray-600 dark:text-gray-400 whitespace-pre-line text-sm mt-1 ${
                !showMore && "line-clamp-3"
              }`}
            >
              {data.description}
            </p>
            <p
              className="text-right mt-2 text-sm text-gray-500 cursor-pointer hover:underline"
              onClick={() => setShowMore(!showMore)}
            >
              read {showMore ? "less" : "more"}
            </p>
            <QuestionImages images={data?.images} />
            <div className="py-2 border-t border-gray-700 mt-5">
              <Bottom
                isReading
                question={data}
                answers={answers}
                setAnswers={setAnswers}
              />
            </div>
          </div>

          <div className="rounded-t-none border border-gray-700 rounded-md p-3">
            <h2 className="text-lg font-semibold mb-2 flex gap-3 items-center">
              Answers{" "}
              {answers.length === 0 && (
                <p className="text-gray-500 text-sm font-normal">
                  (No answers yet. Be the first to answer!)
                </p>
              )}
            </h2>

            {answers.map((answer, idx) => {
              const isReply = (answer?.repliedTo?.length ?? 0) > 0;
              return (
                <AnswerComp
                  key={idx}
                  answer={answer}
                  question={data}
                  isReply={isReply}
                  setAnswers={setAnswers}
                  answers={answers}
                />
              );
            })}
          </div>
        </div>
      ) : (
        <QuestionPageSkeleton />
      )}
    </div>
  );
}
