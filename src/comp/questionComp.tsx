"use client";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useState } from "react";
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
import { Answer, Asker, IQuestion } from "@/lib/models/qModels";

import { ILink } from "@/lib/models/LinkModel";

import QuestionImages from "./qustionImages";

export function Top({
  quest,
  link,
  question,
  answer,
}: {
  quest?: Answer;
  link?: ILink;
  question?: IQuestion;
  answer?: Answer;
}) {
  // const [user, setUser] = useState<User | null>(null);
  const { data: session } = authClient.useSession();

  const asker: Asker =
    question?.asker ||
    (answer && answer.respondent) ||
    link?.owner ||
    quest?.respondent;

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     if (!asker) return;
  //     try {
  //       const res = await fetch(`/api/user/get-user/${asker}`);
  //       if (res.ok) {
  //         const userData = await res.json();
  //         setUser(userData);
  //       } else {
  //         console.error("Failed to fetch user data");
  //       }
  //     } catch (error) {
  //       console.error("Error fetching user data:", error);
  //     }
  //   };
  //   fetchUser();
  // }, [asker]);

  const isAnonymous = question?.isAnonymous || quest?.isAnonymous || false;

  return (
    <div className="w-full flex justify-between items-center">
      <div className="flex items-center text-gray-500 gap-2 hover:text-gray-200 cursor-pointer">
        <Avatar>
          <AvatarImage
            src={
              isAnonymous
                ? ""
                : quest
                ? "/asker.png"
                : asker?.image || "/profilePicture2.png"
            }
            alt="user"
          />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>

        <p className=" text-sm flex items-center">
          <Link href="">
            {session?.user.id === asker.id && isAnonymous
              ? `Anonymous/${asker?.name || "Loading..."}`
              : isAnonymous
              ? "Anonymous"
              : quest
              ? "Asker"
              : asker?.name || "Loading..."}
          </Link>
        </p>
      </div>
      <div className="text-sm text-gray-500">
        {answer?.createdAt?.toString?.().slice(0, 10) ||
          question?.createdAt?.toString?.().slice(0, 10)}
      </div>
    </div>
  );
}

export function Bottom({
  quest,
  isAnswer,
  isReading,
  setAnswers,
  answers,
  question,
  answer,
}: {
  quest?: Answer;
  isAnswer?: boolean;
  setAnswers?: React.Dispatch<React.SetStateAction<Answer[]>>;
  answers?: Answer[];
  isReading?: boolean;
  question?: IQuestion;
  answer?: Answer;
}) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [showMore, setShowMore] = useState(false);

  const [upVotes, setUpVotes] = useState<string[]>(
    (question?.upVotes as string[]) ||
      (answer?.upVotes as string[]) ||
      (quest?.upVotes as string[]) ||
      []
  );
  const [downVotes, setDownVotes] = useState<string[]>(
    (question?.downVotes as string[]) ||
      (answer?.downVotes as string[]) ||
      (quest?.downVotes as string[]) ||
      []
  );

  // 👇 update API route based on question/answer
  const updateVotesInDB = async (
    newUpVotes: string[],
    newDownVotes: string[]
  ) => {
    try {
      if (answer) {
        await fetch(`/api/question/${answer.questionId}/answer/${answer._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            upVotes: newUpVotes,
            downVotes: newDownVotes,
          }),
        });
      } else if (question) {
        await fetch(`/api/question/update-question/${question._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            upVotes: newUpVotes,
            downVotes: newDownVotes,
          }),
        });
      } else if (quest) {
        try {
          const res = await fetch(`/api/link/get-link/${quest.questionId}`);
          const linkData = await res.json();

          if (!linkData?.link) return;

          const updatedQuestions = linkData.link.questions.map((q: Answer) =>
            q._id === quest._id
              ? { ...q, upVotes: newUpVotes, downVotes: newDownVotes }
              : q
          );

          await fetch(`/api/link/update-link/${quest.questionId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ questions: updatedQuestions }),
          });
        } catch (err) {
          console.log("Error updating quest votes:", err);
        }
      }
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

  const [open, setOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = async (replyTextParam: string) => {
    if (!replyTextParam.trim()) return;
    if (!session?.user?.id) return;
    setLoading(true);
    if (!setAnswers || !answers) return;

    const newAnswerObj: Answer = {
      text: replyTextParam,
      respondent: {
        id: session?.user.id,
        name: session.user.name,
        email: session.user.email,
        image: session?.user.image,
      },
      upVotes: [],
      downVotes: [],
      isReply: true,
      repliedTo: answer?._id,
      replies: 0,
      questionId: answer?.questionId as string,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const res = await fetch(
        `/api/question/update-question/${answer?.questionId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answers: [...answers, newAnswerObj],
          }),
        }
      );

      if (res.ok) {
        setReplyText("");
        setOpen(false);
        setAnswers([...answers, newAnswerObj]);
        setLoading(false);
      } else {
        console.error("Failed to add answer");
      }
    } catch (error) {
      console.error("Error adding answer:", error);
    }
  };
  return (
    <div className="pt-2 flex items-center justify-between">
      <div className="flex text-gray-500 items-center gap-2">
        <div
          className={`flex gap-1 cursor-pointer rounded-md p-1 px-1.5 ${
            upVotes.includes(session?.user.id as string)
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
            downVotes.includes(session?.user.id as string)
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
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Reply />
              </Button>
            </DialogTrigger>

            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle className="text-sm text-gray-400 font-normal">
                  Reply to answer
                </DialogTitle>
                <DialogDescription
                  className={`text-gray-600 dark:text-gray-400 text-sm mt-1 ${
                    !showMore && "line-clamp-3"
                  }`}
                >
                  {answer?.text}

                  {answer?.text && answer?.text.length > 100 && (
                    <span
                      className="text-gray-600 dark:text-gray-400 text-sm mt-5 text-end hover:underline cursor-pointer"
                      onClick={() => setShowMore(!showMore)}
                    >
                      {showMore ? "Show less" : "Show more"}
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>

              <form
                onSubmit={(e) => {
                  e.preventDefault();

                  handleReply(replyText);
                  setLoading(false);
                }}
                className="grid gap-4"
              >
                <div className="grid gap-3">
                  <Textarea
                    id="reply"
                    name="reply"
                    className="w-full"
                    rows={6}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit" disabled={loading}>
                    {loading ? "..." : "Reply"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
      <p className="line-clamp-2">{question?.description}</p>

      <QuestionImages images={question?.images || []} />

      <Bottom question={question} />
    </div>
  );
}
