"use client";

import { authClient } from "@/app/lib/auth-client";
import AnswerComp from "@/comp/answerComp";
import { QuestionSkeleton } from "@/comp/questionSkeleton";
import { Answer, IQuestion } from "@/lib/models/qModels";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MyAnswers() {
  const [userAnswers, setUserAnswers] = useState<
    { question: IQuestion; answer: Answer }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const fetchAnswers = async () => {
      try {
        const res = await fetch("/api/question/my-answers");
        const data = await res.json();
        if (data.success) {
          const processed: { question: IQuestion; answer: Answer }[] = [];
          data.questions.forEach((q: IQuestion) => {
            q.answers?.forEach((a: Answer) => {
              if (a.respondent?.id === session?.user?.id) {
                processed.push({ question: q, answer: a });
              }
            });
          });
          setUserAnswers(processed);
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
      {userAnswers.length === 0 ? (
        <div className="text-center text-gray-500 mt-10">
          <p>You haven&apos;t answered any questions yet.</p>
        </div>
      ) : (
        userAnswers.map((item) => (
          <div key={item.answer._id} className="flex flex-col gap-2">
            <div className="text-sm text-gray-500">
              Answer for:{" "}
              <Link
                href={`/question/${item.question._id}`}
                className="text-blue-500 hover:underline"
              >
                {item.question.title}
              </Link>
            </div>
            <AnswerComp
              answer={item.answer}
              question={item.question}
              isReply={item.answer.isReply}
            />
          </div>
        ))
      )}
    </div>
  );
}
