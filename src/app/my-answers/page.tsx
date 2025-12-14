"use client";

import { authClient } from "@/app/lib/auth-client";
import QuestionComp from "@/comp/questionComp";
import { QuestionSkeleton } from "@/comp/questionSkeleton";
import { IQuestion } from "@/lib/models/qModels";
import { useEffect, useState } from "react";

export default function MyAnswers() {
  const [questions, setQuestions] = useState<IQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await fetch("/api/question/my-answers");
        const data = await res.json();
        if (data.success) {
          setQuestions(data.questions);
        }
      } catch (error) {
        console.error("Error fetching answers:", error);
      } finally {
        setLoading(false);
      }
    };

    if (session?.user) {
      fetchAnswers();
    }
  }, [session]);

  if (loading) {
    return (
      <div className="flex flex-col gap-4 p-4">
        {[1, 2, 3].map((i) => (
          <QuestionSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 p-4 pb-20">
      <h1 className="text-2xl font-bold mb-4">My Answers</h1>
      {questions.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>You haven&apos;t answered any questions yet.</p>
        </div>
      ) : (
        questions.map((question) => (
          <QuestionComp key={question._id} question={question} />
        ))
      )}
    </div>
  );
}
