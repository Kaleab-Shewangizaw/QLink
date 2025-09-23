"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Reply } from "lucide-react";
import { BsEye } from "react-icons/bs";
import { BiComment, BiDownArrow, BiUpArrow } from "react-icons/bi";

export function Top() {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center text-gray-500 gap-2 hover:text-blue-700">
        <Avatar>
          <AvatarImage src="/profilePicture2.png" alt="user" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>

        <p className=" text-sm  flex items-center ">
          <Link href="" className="">
            username{" "}
          </Link>
        </p>
      </div>
      <div className="text-sm text-gray-500">
        {new Date().toString().slice(0, 15)}
      </div>
    </div>
  );
}

export function Bottom({
  isAnswer,
  isReading,
}: {
  isAnswer?: boolean;
  isReading?: boolean;
}) {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState("");
  const [count, setCount] = useState(0);

  return (
    <div className="pt-2 flex items-center justify-between">
      <div className="flex  text-gray-500 items-center ">
        <div
          className={`flex gap-1 cursor-pointer rounded-md p-1 px-1.5 ${
            isLiked === "T" &&
            "bg-gray-800 text-gray-300 not-dark:bg-gray-200 not-dark:text-gray-700"
          }`}
          onClick={() => {
            if (isLiked === "F") {
              setIsLiked("T");
              setCount(count + 2);
            } else if (isLiked === "T") {
              setIsLiked("");
              setCount(count - 1);
            } else {
              setIsLiked("T");
              setCount(count + 1);
            }
          }}
        >
          <BiUpArrow />
        </div>
        <div
          className={`cursor-pointer rounded-md p-1 px-1.5 ml-2 ${
            isLiked == "F" &&
            "bg-gray-800 text-gray-300 not-dark:bg-gray-200 not-dark:text-gray-700"
          }`}
          onClick={() => {
            if (isLiked === "F") {
              setIsLiked("");
              setCount(count + 1);
            } else if (isLiked === "T") {
              setIsLiked("F");
              setCount(count - 2);
            } else {
              setIsLiked("F");
              setCount(count - 1);
            }
          }}
        >
          <BiDownArrow />
        </div>
        <span className="text-sm ml-3">{count}</span>
      </div>
      <div className="flex items-center gap-4">
        {!isAnswer && (
          <>
            <div className="text-gray-500 flex items-start gap-1 text-sm">
              3 <BsEye size={15} />
            </div>
            <div className="text-gray-500 flex items-start gap-1 text-sm">
              3 <BiComment size={15} />
            </div>
          </>
        )}
        {isAnswer ? (
          <>
            <div className="text-gray-500 flex items-start gap-1 text-sm">
              3 <Reply size={15} />
            </div>
            <Button variant="outline" size="sm">
              <Reply />
            </Button>
          </>
        ) : !isReading ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              router.push("/question/123");
            }}
          >
            Answer/read
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default function QuestionComp() {
  return (
    <div className="w-full p-2  shadow-md/10 dark:border rounded-md dark:border-gray-900 ">
      <Top />
      <div className="p-2">What is your favorite food or restaurant?</div>
      <Bottom />
    </div>
  );
}
