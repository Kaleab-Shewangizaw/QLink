"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Reply } from "lucide-react";
import { BsEye } from "react-icons/bs";
import { BiComment, BiDownArrow, BiUpArrow } from "react-icons/bi";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

export function Top() {
  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center text-gray-500 gap-2 hover:text-gray-200 cursor-pointer">
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
  const [showMore, setShowMore] = useState(false);

  return (
    <div className="pt-2 flex items-center justify-between">
      <div className="flex  text-gray-500 items-center ">
        <div
          className={`flex gap-1 cursor-pointer rounded-md p-1 px-1.5 ${
            isLiked === "T" &&
            "bg-gray-800 text-gray-300 not-dark:bg-gray-400 not-dark:text-gray-700"
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
            "bg-gray-800 text-gray-300 not-dark:bg-gray-400 not-dark:text-gray-700"
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

            <Dialog>
              <form action="">
                <DialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Reply />
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[525px]">
                  <DialogHeader>
                    <DialogTitle>
                      <h1 className="text-sm  text-gray-400 font-normal ">
                        reply to{" "}
                        <span className="font-semibold dark:text-gray-200 text-gray-600 cursor-pointer hover:underline">
                          username
                        </span>
                        &apos;s answer in{" "}
                        <span className="font-semibold dark:text-gray-200 text-gray-600 cursor-pointer hover:underline">
                          username
                        </span>
                        &apos;s question
                      </h1>
                    </DialogTitle>
                    <DialogDescription>
                      <p
                        className={`text-gray-600 dark:text-gray-400 text-sm mt-1 ${
                          !showMore && "line-clamp-3"
                        }`}
                      >
                        Lorem ipsum, dolor sit amet consectetur adipisicing
                        elit. Tempore, beatae praesentium harum eius quis quae
                        culpa fugiat commodi! Soluta, eius!
                      </p>
                      <p
                        className="text-gray-600 dark:text-gray-400 text-sm mt-5 text-end hover:underline  cursor-pointer"
                        onClick={() => setShowMore(!showMore)}
                      >
                        Show more
                      </p>
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Textarea
                        id="name-1"
                        name="name"
                        className="w-full"
                        rows={10}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Answer</Button>
                  </DialogFooter>
                </DialogContent>
              </form>
            </Dialog>
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

export default function QuestionComp({ question }: { question?: any }) {
  return (
    <div className="w-full p-2  shadow-md/10 dark:border rounded-md dark:border-gray-900 ">
      <Top />
      <div className="p-2">{question?.title}</div>
      <Bottom />
    </div>
  );
}
