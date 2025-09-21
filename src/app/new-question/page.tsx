"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NewQuestion() {
  const router = useRouter();
  return (
    <div className="p-2 py-5 flex flex-col ">
      <button
        onClick={() => router.back()}
        className="text-gray-500 mb-5 hover:text-gray-300 cursor-pointer  flex items-center gap-1 w-fit"
      >
        <ArrowLeft /> Back
      </button>
      <div className="border border-gray-700 rounded-md p-4 text-center">
        <form action="">
          <h1 className="text-lg font-semibold">New Question</h1>
          <div className="grid gap-4 py-5">
            <div className="grid gap-2">
              <Label className="mt-4">
                Your Question*{" "}
                <span className="text-gray-400 font-normal">
                  250 characters
                </span>
              </Label>
              <Textarea maxLength={250} required rows={3} />
            </div>
            <div className="grid gap-2">
              <Label className="mt-4">
                Description{" "}
                <span className="text-gray-400 font-normal">
                  1500 characters
                </span>
              </Label>
              <Textarea
                maxLength={1500}
                placeholder="your description..."
                rows={10}
              />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" type="button">
              Cancel
            </Button>
            <Button variant="outline" type="submit">
              Submit
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
