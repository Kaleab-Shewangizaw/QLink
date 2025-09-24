"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Reply } from "lucide-react";
import { BsEye } from "react-icons/bs";
import { BiComment, BiDownArrow, BiUpArrow } from "react-icons/bi";
import { authClient } from "@/app/lib/auth-client";
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
import { IQuestion } from "@/lib/models/qModels";
import { User } from "better-auth";

export function Top({ question }: { question?: IQuestion }) {
  const [user, setUser] = useState<User | null>(null);
  const { data: session } = authClient.useSession();

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const res = await fetch(`/api/user/get-user/${question?.asker}`);
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error("Error fetching asker:", error);
      }
    };

    if (question?.asker) fetchQuestion();
  }, [question?.asker]);

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center text-gray-500 gap-2 hover:text-gray-200 cursor-pointer">
        <Avatar>
          <AvatarImage
            src={
              question?.isAnonymous ? "" : user?.image || "/profilePicture2.png"
            }
            alt="user"
          />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>

        <p className=" text-sm flex items-center">
          <Link href="" className="">
            {session?.user.id === question?.asker && question?.isAnonymous
              ? `Anonymous/${user?.name}`
              : question?.isAnonymous
              ? "Anonymous"
              : user?.name}
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
  question,
}: {
  isAnswer?: boolean;
  isReading?: boolean;
  question?: IQuestion;
}) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [showMore, setShowMore] = useState(false);
  const [upVotes, setUpVotes] = useState<string[]>(question?.upVotes || []);
  const [downVotes, setDownVotes] = useState<string[]>(
    question?.downVotes || []
  );

  const handleRead = async (id: string) => {
    try {
      await fetch(`/api/question/update-question/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          views: question?.views ? question?.views + 1 : 1,
        }),
      });
    } catch (error) {
      console.error("Error updating question views:", error);
    }
  };

  const updateVotesInDB = async (
    newUpVotes: string[],
    newDownVotes: string[]
  ) => {
    if (!question?._id) return;
    try {
      await fetch(`/api/question/update-question/${question._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          upVotes: newUpVotes,
          downVotes: newDownVotes,
        }),
      });
    } catch (err) {
      console.log("Error updating votes:", err);
    }
  };

  const handleUpvote = () => {
    if (!session?.user?.id) return;
    let newUpVotes = [...upVotes];
    let newDownVotes = [...downVotes];

    if (upVotes.includes(session.user.id)) {
      newUpVotes = upVotes.filter((vote) => vote !== session.user.id);
    } else {
      newUpVotes = [...upVotes, session.user.id];
      newDownVotes = downVotes.filter((vote) => vote !== session.user.id);
    }

    setUpVotes(newUpVotes);
    setDownVotes(newDownVotes);
    updateVotesInDB(newUpVotes, newDownVotes);
  };

  const handleDownvote = () => {
    if (!session?.user?.id) return;
    let newUpVotes = [...upVotes];
    let newDownVotes = [...downVotes];

    if (downVotes.includes(session.user.id)) {
      // remove downvote
      newDownVotes = downVotes.filter((vote) => vote !== session.user.id);
    } else {
      // add downvote, remove from upvotes if exists
      newDownVotes = [...downVotes, session.user.id];
      newUpVotes = upVotes.filter((vote) => vote !== session.user.id);
    }

    setUpVotes(newUpVotes);
    setDownVotes(newDownVotes);
    updateVotesInDB(newUpVotes, newDownVotes);
  };

  return (
    <div className="pt-2 flex items-center justify-between">
      <div className="flex text-gray-500 items-center gap-2">
        <div
          className={`flex gap-1 cursor-pointer rounded-md p-1 px-1.5 ${
            upVotes.includes(session.user.id)
              ? "bg-gray-800 text-gray-300 not-dark:bg-gray-400 not-dark:text-gray-700"
              : ""
          }`}
          onClick={handleUpvote}
        >
          <BiUpArrow />
          <span className="text-sm">{upVotes.length}</span>
        </div>

        <div
          className={`flex gap-1 cursor-pointer rounded-md p-1 px-1.5 ${
            downVotes.includes(session.user.id)
              ? "bg-gray-800 text-gray-300 not-dark:bg-gray-400 not-dark:text-gray-700"
              : ""
          }`}
          onClick={handleDownvote}
        >
          <BiDownArrow />
          <span className="text-sm">{downVotes.length}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        {!isAnswer && (
          <>
            <div className="text-gray-500 flex items-start gap-1 text-sm">
              {question?.views} <BsEye size={15} />
            </div>
            <div className="text-gray-500 flex items-start gap-1 text-sm">
              {question?.answers?.length} <BiComment size={15} />
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
                        className="text-gray-600 dark:text-gray-400 text-sm mt-5 text-end hover:underline cursor-pointer"
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
              router.push(`/question/${question?._id}`);
              handleRead(question?._id as string);
            }}
          >
            Answer/read
          </Button>
        ) : null}
      </div>
    </div>
  );
}

export default function QuestionComp({ question }: { question?: IQuestion }) {
  return (
    <div className="w-full p-2 shadow-md/10 dark:border rounded-md dark:border-gray-900">
      <Top question={question} />
      <div className="p-2">{question?.title}</div>
      <Bottom question={question} />
    </div>
  );
}
