import { Bottom, Top } from "./questionComp";

export default function AnswerComp() {
  return (
    <div className="w-full p-2 mt-4 shadow-md/10 dark:border rounded-md dark:border-gray-900 ">
      <Top />
      <div className="mt-2 text-gray-400 text-sm">
        This is an example answer. This is an example answer. This is an example
        answer. This is an example answer
      </div>
      <Bottom isAnswer />
    </div>
  );
}
