"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

function Top() {
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
      <div className="text-sm text-gray-500">date</div>
    </div>
  );
}

function Bottom() {
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
      <div></div>
    </div>
  );
}

export default function QuestionPage() {
  const [showMore, setShowMore] = useState(false);
  const router = useRouter();
  return (
    <div className="p-2 py-5 flex flex-col ">
      <button
        onClick={() => router.back()}
        className="text-gray-500 mb-5 hover:text-gray-300 cursor-pointer  flex items-center gap-1 w-fit"
      >
        <ArrowLeft /> Back
      </button>
      <div>
        <div className="border border-gray-700 rounded-md p-4 ">
          <Top />
          <h1 className="text-lg font-semibold">
            Question TitleQuestion TitleQuestion TitleQuestion TitleQuestion
            TitleQuestion Title
          </h1>

          <p
            className={`text-gray-400 text-sm mt-1 ${
              !showMore && "line-clamp-3"
            }`}
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            fringilla, nunc sit amet varius dignissim, nunc nisl aliquam nunc,
            eget aliquam nisl nunc sit amet lorem. Sed fringilla, nunc sit amet
            varius dignissim, nunc nisl aliquam nunc, eget aliquam nisl nunc sit
            amet lorem. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
            Sed fringilla, nunc sit amet varius dignissim, nunc nisl aliquam
            nunc, eget aliquam nisl nunc sit amet lorem. Sed fringilla, nunc sit
            amet varius dignissim, nunc nisl aliquam nunc, eget aliquam nisl
            nunc sit amet lorem.
          </p>
          <p
            className="text-right mt-2 text-sm text-gray-500 cursor-pointer hover:underline "
            onClick={() => {
              setShowMore(!showMore);
            }}
          >
            read {showMore ? "less" : "more"}
          </p>
          <div className="py-2 border-t border-gray-700 mt-5">
            <Bottom />
          </div>
        </div>
        <div className="mt-5 border border-gray-700 rounded-md p-4 ">
          <h2 className="text-lg font-semibold mb-2">Answers</h2>
          <p className="text-gray-500">
            No answers yet. Be the first to answer!
          </p>
        </div>
      </div>
    </div>
  );
}
