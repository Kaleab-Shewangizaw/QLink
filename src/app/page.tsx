"use client";

import { useEffect, useState } from "react";
import QuestionComp from "../comp/questionComp";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  useEffect(() => {
    //fetch questions from the database
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/question/get-all-questions");
        const data = await res.json();
        setData(data.questions);
        console.log(data);
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchQuestions();
  }, []);
  return (
    <div className="mt-5  px-2 pb-10 flex flex-col gap-4 ">
      {data.map((question) => (
        <QuestionComp key={question.id} question={question} />
      ))}
    </div>
  );
}
