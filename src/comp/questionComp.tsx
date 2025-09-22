"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Reply } from "lucide-react";
import { BsEye } from "react-icons/bs";

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
  const [like, setLike] = useState(false);
  const [dislike, setDislike] = useState(false);

  return (
    <div className="pt-2 flex items-center justify-between">
      <div className="flex gap-4 text-gray-500 items-center ">
        <div
          className={`flex gap-1 cursor-pointer rounded-md p-1 px-1.5 ${
            like &&
            "bg-gray-800 text-gray-300 not-dark:bg-gray-200 not-dark:text-gray-700"
          }`}
          onClick={() => {
            setDislike(false);
            setLike(!like);
          }}
        >
          <span>👍</span>
          <span>{like ? 1 : 0}</span>
        </div>
        <div
          className={`flex gap-1 cursor-pointer  rounded-md p-1 px-1.5 ${
            dislike &&
            "bg-gray-800 text-gray-300 not-dark:bg-gray-200 not-dark:text-gray-700"
          }`}
          onClick={() => {
            setLike(false);
            setDislike(!dislike);
          }}
        >
          <span>👎</span>
          <span>{dislike ? 1 : 0}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        {!isAnswer && (
          <>
            <div className="text-gray-500 flex items-start gap-1 text-sm">
              3 <BsEye size={15} />
            </div>
            <div className="text-gray-500 flex items-start gap-1 text-sm">
              3 <Reply size={15} />
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
            size="sm"
            onClick={() => {
              router.push("/question/123");
            }}
          >
            Answer/read
          </Button>
        ) : //views count goes here
        null}
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
