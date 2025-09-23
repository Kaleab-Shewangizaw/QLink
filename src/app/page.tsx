"use client";

import { useEffect, useState } from "react";
import QuestionComp from "../comp/questionComp";
import { QuestionSkeleton } from "../comp/questionSkeleton";

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch("/api/question/get-all-questions");
        const data = await res.json();
        setData(data.questions);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="mt-5 px-2 pb-10 flex flex-col gap-4">
      {loading
        ? Array.from({ length: 4 }).map((_, i) => <QuestionSkeleton key={i} />)
        : data.map((question) => (
            <QuestionComp key={question._id} question={question} />
          ))}
    </div>
  );
}
