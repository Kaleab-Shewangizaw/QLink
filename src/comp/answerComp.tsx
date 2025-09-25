import { Answer } from "@/lib/models/qModels";
import { Bottom, Top } from "./questionComp";

export default function AnswerComp({
  answer,
  isReply,
}: {
  answer: Answer;
  isReply?: boolean;
}) {
  return (
    <div
      className={`w-full  mt-4 shadow-md/10 dark:border rounded-md dark:border-gray-900 relative ${
        isReply ? "mt-15 p-2 pt-10 " : "mt-4 p-2"
      }`}
    >
      {isReply && (
        <div className="absolute -top-10 p-2 dark:bg-[#0a0a0a] bg-[#ffffff] w-[90%] mx-auto border right-2">
          <Top answer={answer} />
          <div className="mt-2 dark:text-gray-400 text-sm text-gray-600">
            {answer.text}
            {answer.respondent}
          </div>
        </div>
      )}
      {!isReply && <Top answer={answer} />}
      <div className="mt-2 dark:text-gray-400 text-sm text-gray-600">
        {answer.text}
      </div>
      <Bottom isAnswer answer={answer} />
    </div>
  );
}
