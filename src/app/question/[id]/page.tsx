"use client";

import AnswerComp from "@/comp/answerComp";
import { Bottom, Top } from "@/comp/questionComp";
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
import { ArrowLeft } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuestionPage() {
  const [showMore, setShowMore] = useState(false);
  const [data, setData] = useState<any>(null);
  const router = useRouter();
  const params = useParams();
  const questionId = params.id as string;

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/question/get-question/${questionId}`);
        const data = await res.json();
        setData(data.question);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };

    if (questionId) fetchQuestion();
  }, [questionId]);

  return (
    <div className="px-2 pb-5 flex flex-col">
      <div className="sticky top-13 z-10 bg-white dark:bg-[#0a0a0a] p-2 left-0 border border-gray-700 border-b-0 text-gray-500 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="hover:text-gray-300 cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft /> Back
        </button>
        <Dialog>
          <form action="">
            <DialogTrigger asChild>
              <Button variant="outline">Answer</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>
                  <h1 className="text-sm text-gray-400 font-normal">
                    Answer to{" "}
                    <span className="font-semibold dark:text-gray-200 text-gray-600 cursor-pointer hover:underline">
                      username
                    </span>
                    &apos;s question
                  </h1>
                </DialogTitle>
                <DialogDescription>
                  <h1 className="text-lg font-semibold line-clamp-3 text-gray-500">
                    {data?.title}
                  </h1>
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Textarea
                    id="answer"
                    name="answer"
                    className="w-full"
                    rows={10}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Answer</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>
      </div>

      {data ? (
        <div>
          <div className="border border-gray-700 p-4 rounded-b-none border-y-0">
            <Top />
            <h1 className="text-lg font-semibold">{data.title}</h1>
            <p
              className={`text-gray-600 dark:text-gray-400 text-sm mt-1 ${
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
            <div className="py-2 border-t border-gray-700 mt-5">
              <Bottom isReading />
            </div>
          </div>

          <div className="rounded-t-none border border-gray-700 rounded-md p-3">
            <h2 className="text-lg font-semibold mb-2">Answers</h2>
            {data.answers.length === 0 && (
              <p className="text-gray-500">
                No answers yet. Be the first to answer!
              </p>
            )}
            {data.answers.map((answer: any, idx: number) => (
              <AnswerComp key={idx} data={answer} />
            ))}
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Loading question...</p>
      )}
    </div>
  );
}
