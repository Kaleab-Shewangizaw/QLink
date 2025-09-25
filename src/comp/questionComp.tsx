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
import { Answer, IQuestion } from "@/lib/models/qModels";
import { User } from "better-auth";

// ------------------ TOP -------------------
export function Top({
  question,
  answer,
}: {
  question?: IQuestion;
  answer?: Answer;
}) {
  const [user, setUser] = useState(null);
  const { data: session } = authClient.useSession();

  const asker = question?.asker || (answer && answer.respondent);

  useEffect(() => {
    const fetchUser = async () => {
      if (!asker) return;
      try {
        const res = await fetch(`/api/user/get-user/${asker}`);
        if (res.ok) {
          const userData = await res.json();
          setUser(userData);
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };
    fetchUser();
  }, [asker]);
  console.log("question?.asker", question);

  const isAnonymous = question?.isAnonymous;

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center text-gray-500 gap-2 hover:text-gray-200 cursor-pointer">
        <Avatar>
          <AvatarImage
            src={isAnonymous ? "" : user?.image || "/profilePicture2.png"}
            alt="user"
          />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>

        <p className=" text-sm flex items-center">
          <Link href="">
            {session?.user.id === asker && isAnonymous
              ? `Anonymous/${user?.name || "name"}`
              : isAnonymous
              ? "Anonymous"
              : user?.name || "name"}
          </Link>
        </p>
      </div>
      <div className="text-sm text-gray-500">
        {answer?.createdAt.toString().slice(0, 10) ||
          question?.createdAt.toString().slice(0, 10)}
      </div>
    </div>
  );
}

export function Bottom({
  isAnswer,
  isReading,
  question,
  answer,
}: {
  isAnswer?: boolean;
  isReading?: boolean;
  question?: IQuestion;
  answer?: Answer;
}) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [showMore, setShowMore] = useState(false);

  const [upVotes, setUpVotes] = useState<string[]>(
    question?.upVotes || answer?.upVotes || []
  );
  const [downVotes, setDownVotes] = useState<string[]>(
    question?.downVotes || answer?.downVotes || []
  );

  // Update DB for both question and answer
  const updateVotesInDB = async (
    newUpVotes: string[],
    newDownVotes: string[]
  ) => {
    const id = question?._id || answer?._id;
    const apiRoute = question
      ? `/api/question/update-question/${id}`
      : `/api/answer/update-answer/${id}`;
    try {
      await fetch(apiRoute, {
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
      newDownVotes = downVotes.filter((vote) => vote !== session.user.id);
    } else {
      newDownVotes = [...downVotes, session.user.id];
      newUpVotes = upVotes.filter((vote) => vote !== session.user.id);
    }

    setUpVotes(newUpVotes);
    setDownVotes(newDownVotes);
    updateVotesInDB(newUpVotes, newDownVotes);
  };

  const handleRead = async (id: string) => {
    if (!question) return;
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

  return (
    <div className="pt-2 flex items-center justify-between">
      <div className="flex text-gray-500 items-center gap-2">
        <div
          className={`flex gap-1 cursor-pointer rounded-md p-1 px-1.5 ${
            upVotes.includes(session?.user.id)
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
            downVotes.includes(session?.user.id)
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
                        Reply to answer
                      </h1>
                    </DialogTitle>
                    <DialogDescription>
                      <p
                        className={`text-gray-600 dark:text-gray-400 text-sm mt-1 ${
                          !showMore && "line-clamp-3"
                        }`}
                      >
                        {answer?.text}
                      </p>
                      {answer?.text && answer?.text.length > 100 && (
                        <p
                          className="text-gray-600 dark:text-gray-400 text-sm mt-5 text-end hover:underline cursor-pointer"
                          onClick={() => setShowMore(!showMore)}
                        >
                          {showMore ? "Show less" : "Show more"}
                        </p>
                      )}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4">
                    <div className="grid gap-3">
                      <Textarea
                        id="reply"
                        name="reply"
                        className="w-full"
                        rows={6}
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button type="submit">Reply</Button>
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
