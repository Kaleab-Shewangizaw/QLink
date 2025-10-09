"use client";

import QuestionComp from "@/comp/questionComp";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyQuestionsPage() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      const res = await fetch("/api/question/my-questions");
      if (res.ok) {
        const data = await res.json();
        setQuestions(data.questions);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, []);

  return (
    <div className="md:p-2">
      <div className="sticky top-12 z-10 bg-white dark:bg-[#0a0a0a] p-2 left-0  text-gray-500 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="hover:text-gray-300 cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft /> Back
        </button>
      </div>
      <h1 className="text-2xl font-bold mt-4">My Questions</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {questions.map((question) => (
            <QuestionComp key={question._id} question={question} />
          ))}
        </ul>
      )}
    </div>
  );
}
