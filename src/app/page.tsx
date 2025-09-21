import QuestionComp from "../comp/questionComp";

export default function Home() {
  return (
    <div className="mt-5 h-[93%] overflow-auto px-2 pb-10 flex flex-col gap-4 removeScrollBar relative">
      <QuestionComp />
    </div>
  );
}
