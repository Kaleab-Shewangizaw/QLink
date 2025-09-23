import { Bottom, Top } from "./questionComp";

export default function AnswerComp({ isReply }: { isReply?: boolean }) {
  return (
    <div
      className={`w-full  mt-4 shadow-md/10 dark:border rounded-md dark:border-gray-900 relative ${
        isReply ? "mt-15 p-2 pt-10 " : "mt-4 p-2"
      }`}
    >
      {isReply && (
        <div className="absolute -top-10 p-2 dark:bg-[#0a0a0a] bg-[#ffffff] w-[90%] mx-auto border right-2">
          <Top />
          <div className="mt-2 dark:text-gray-400 text-sm text-gray-600">
            content
          </div>
        </div>
      )}
      {!isReply && <></>}
      <Top />
      <div className="mt-2 dark:text-gray-400 text-sm text-gray-600 ">
        This is an example answer. This is an example answer. This is an example
        answer. This is an example answer
      </div>
      <Bottom isAnswer />
    </div>
  );
}
