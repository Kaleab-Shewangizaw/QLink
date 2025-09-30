"use client";

import { authClient } from "@/app/lib/auth-client";
import { Top } from "@/comp/questionComp";
import { Button } from "@/components/ui/button";

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
import { ILink } from "@/lib/models/LinkModel";
import { Answer } from "@/lib/models/qModels";
import { ArrowLeft, TrashIcon } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

async function fetchLink(id: string): Promise<ILink> {
  const res = await fetch(`/api/link/get-link/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch link");
  }
  return res.json();
}

export default function LinkPage() {
  const { data: session } = authClient.useSession();
  const userId = session?.user?.id;
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ILink>();
  const [error, setError] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [questions, setQuestions] = useState<Answer[]>([]);
  const [open, setOpen] = useState(false);

  const params = useParams();
  const linkId = params.id as string;
  useEffect(() => {
    const getLink = async () => {
      try {
        const linkData = await fetchLink(linkId);

        if (!linkData) {
          setError(true);
          return;
        }
        setData(linkData.link);
        setQuestions(linkData.link.questions || []);
        console.log("fetched link data:", linkData);
        if (!linkData.link.isOpen) {
          setError(true);
        }
      } catch (error) {
        console.error("Error fetching link:", error);
        setError(true);
      }
    };
    if (linkId) getLink();
  }, [linkId]);

  console.log("link data:", data);

  const handleDelete = async (id: string | undefined) => {
    setLoading(true);
    if (!id) return;

    try {
      const res = await fetch(`/api/link/delete-link/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.back();
      } else {
        console.error("Failed to delete link");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
      setLoading(false);
    }
  };

  const handleAddQuestion = async () => {
    if (!session?.user) return;
    if (!newQuestion.trim()) return;

    const newQuestionObj: Answer = {
      text: newQuestion,
      respondent: userId,
      upVotes: [],
      downVotes: [],
      questionId: data?._id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      const res = await fetch(`/api/link/update-link/${data?._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: newQuestionObj,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setQuestions(data.link.questions || []);

        setNewQuestion("");
        setOpen(false);
      } else {
        console.error("Failed to add question");
      }
    } catch (error) {
      console.error("Error adding answer:", error);
    }
  };

  const router = useRouter();

  return (
    <div className="p-2">
      <div className="sticky top-12 z-10 bg-white dark:bg-[#0a0a0a] p-2 left-0 text-gray-500 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="hover:text-gray-300 cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft /> Back
        </button>
        <div className="flex items-center gap-2">
          {userId === data?.owner && (
            <>
              <Button
                variant={"outline"}
                disabled={loading}
                className="text-red-400"
                onClick={() => {
                  setLoading(true);
                  if (confirm("are you sure you want to delete this question?"))
                    handleDelete(data?._id);
                  setLoading(false);
                }}
              >
                <TrashIcon /> {loading ? "Deleting" : "Delete"}
              </Button>
            </>
          )}
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              {data?.isOpen && (
                <Button variant="outline" disabled={loading}>
                  Ask
                </Button>
              )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle className="text-sm text-gray-400 font-normal">
                  write your question down below.
                </DialogTitle>
                <DialogDescription className="text-lg font-semibold line-clamp-3 text-gray-500">
                  {data?.name}
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Textarea
                    id="answer"
                    name="answer"
                    className="w-full"
                    rows={10}
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleAddQuestion}>Ask</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      {error ? (
        <div className="flex items-center justify-center text-xl text-gray-600">
          Link closed or expired!
        </div>
      ) : (
        <>
          <div className="w-full p-2 shadow-md/10 dark:border rounded-md dark:border-gray-900">
            <Top link={data} />
            <div className="p-2 py-4 text">{data?.name}</div>
          </div>
        </>
      )}
      <div className="w-full border my-5" />

      {questions.map((question) => (
        <div key={question._id} className="w-full">
          <div className="w-full p-2 shadow-md/10 dark:border rounded-md dark:border-gray-900 mt-4">
            <Top quest={question} />
            <div className="p-2 py-4 text">{question.text}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
