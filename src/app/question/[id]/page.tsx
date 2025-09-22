"use client";

import AnswerComp from "@/comp/answerComp";
import { Bottom, Top } from "@/comp/questionComp";
import { Button } from "@/components/ui/button";

import { ArrowLeft } from "lucide-react";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function QuestionPage() {
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();
  return (
    <div className="px-2 pb-5 flex flex-col  ">
      <div className="sticky top-13 z-10 bg-white dark:bg-black p-2 left-0 border  border-b-0  text-gray-500 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className=" hover:text-gray-300 cursor-pointer  flex items-center gap-1"
        >
          <ArrowLeft /> Back
        </button>
        <Button size="sm">Answer</Button>
      </div>
      <div>
        <div className="border border-gray-700  p-4 rounded-b-none border-y-0">
          <Top />
          <h1 className="text-lg font-semibold">
            Question TitleQuestion TitleQuestion TitleQuestion TitleQuestion
            TitleQuestion Title
          </h1>

          <p
            className={`text-gray-600 dark:text-gray-400 text-sm mt-1 ${
              !showMore && "line-clamp-3"
            }`}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            fringilla, nunc sit amet varius dignissim, nunc nisl aliquam nunc,
            eget aliquam nisl nunc sit amet lorem. Sed fringilla, nunc sit amet
            varius dignissim, nunc nisl aliquam nunc, eget aliquam nisl nunc sit
            amet lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed fringilla, nunc sit amet varius dignissim, nunc nisl aliquam
            nunc, eget aliquam nisl nunc sit amet lorem. Sed fringilla, nunc sit
            amet varius dignissim, nunc nisl aliquam nunc, eget aliquam nisl
            nunc sit amet lorem.
          </p>
          <p
            className="text-right mt-2 text-sm text-gray-500 cursor-pointer hover:underline "
            onClick={() => {
              setShowMore(!showMore);
            }}
          >
            read {showMore ? "less" : "more"}
          </p>
          <div className="py-2 border-t border-gray-700 mt-5">
            <Bottom isReading />
          </div>
        </div>
        <div className="rounded-t-none border border-gray-700 rounded-md p-3 ">
          <h2 className="text-lg font-semibold mb-2">Answers</h2>
          {/* <p className="text-gray-500">
            No answers yet. Be the first to answer!
          </p> */}
          <AnswerComp />
          <AnswerComp />
          <AnswerComp />
          <AnswerComp />
        </div>
      </div>
    </div>
  );
}
