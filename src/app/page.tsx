"use client";
import { useEffect } from "react";
import QuestionComp from "../comp/questionComp";
import { authClient } from "./lib/auth-client";

export default function Home() {
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (session) {
      console.log("we have session:", session);
    }
  }, [session, isPending]);
  return (
    <div className="mt-5  px-2 pb-10 flex flex-col gap-4 ">
      <QuestionComp />
      <QuestionComp />
      <QuestionComp />
      <QuestionComp />
      <QuestionComp />
      <QuestionComp />
      <QuestionComp />
      <QuestionComp />
      <QuestionComp />
      <QuestionComp />
      <QuestionComp />
    </div>
  );
}
