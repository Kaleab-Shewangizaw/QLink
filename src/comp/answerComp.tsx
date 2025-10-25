import { Answer, IQuestion } from "@/lib/models/qModels";
import { Bottom, Top } from "./questionComp";
import Link from "next/link";

export default function AnswerComp({
  question,
  quest,
  answer,
  setAnswers,
  answers,
  isReply,
}: {
  quest?: Answer;
  question?: IQuestion;
  answer: Answer;
  setAnswers?: React.Dispatch<React.SetStateAction<Answer[]>>;
  answers?: Answer[];
  isReply?: boolean;
}) {
  let repliedAns: Answer | undefined;

  if (isReply) {
    repliedAns = question?.answers?.find((ans) => ans._id === answer.repliedTo);
  }

  return (
    <div
      className={`w-full  mt-4 shadow-md/10 dark:border rounded-md dark:border-gray-900 relative ${
        isReply ? "mt-15 p-2 pt-10 " : "mt-4 p-2"
      }`}
    >
      {isReply && (
        <div className="absolute -top-10 p-2 dark:bg-[#0a0a0a] bg-[#ffffff] w-[90%] mx-auto border right-2">
          <Top answer={repliedAns} />
          <div className="mt-2 dark:text-gray-400 text-sm text-gray-600 line-clamp-1 ">
            <Link href={`/question/${question?._id}/#${repliedAns?._id}`}>
              {repliedAns?.text}
            </Link>
          </div>
        </div>
      )}
      <Top answer={answer} quest={quest} />
      <div
        className="mt-2 dark:text-gray-400 text-sm text-gray-600"
        style={{ scrollMarginTop: "200px" }}
        id={answer?._id}
      >
        {answer?.text || quest?.text}
      </div>
      <Bottom
        isAnswer
        answer={answer}
        setAnswers={setAnswers}
        answers={answers}
        quest={quest}
      />
    </div>
  );
}
