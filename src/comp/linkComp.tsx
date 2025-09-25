"use client";

import { Button } from "@/components/ui/button";
import { ILink } from "@/lib/models/LinkModel";
import { Check, Copy } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function LinkComp({ link }: { link: ILink }) {
  const [isClosed, setIsClosed] = useState(link.isOpen);
  const [copied, setCopied] = useState(false);

  const handleClose = async () => {
    try {
      const newState = !isClosed; // compute new state
      setIsClosed(newState);

      await fetch(`/api/link/update-link/${link._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isOpen: newState }),
      });
    } catch (error) {
      console.error("Failed to update link state:", error);
    }
  };

  return (
    <div>
      <div className="w-full flex items-center justify-between mt-4 shadow-md/10 dark:border rounded-md dark:border-gray-900 px-2 py-4">
        <div>
          <h1>
            <Link
              className="hover:underline mr-2 text-lg font-semibold cursor-pointer"
              href={`/link/${link._id}/${link.name}`}
            >
              {link.name}
            </Link>
            {isClosed ? (
              <span className="text-xs text-green-500">Open</span>
            ) : (
              <span className="text-xs text-red-500">Closed</span>
            )}
          </h1>
          <div className="text-sm text-gray-500">
            {link.questions.length} Questions
          </div>
        </div>
        <div className="text-sm text-gray-400 flex items-center">
          <Button
            size="sm"
            variant="ghost"
            className="mr-2"
            onClick={() => {
              navigator.clipboard.writeText(
                `${window.location.origin}/link/${link._id}/${link.name}`
              );
              setCopied(true);
              setTimeout(() => setCopied(false), 2000);
            }}
          >
            {copied ? <Check className="text-green-500" /> : <Copy />}
          </Button>
          <Button
            size="sm"
            variant="outline"
            className={`font-normal 
            }`}
            onClick={handleClose}
          >
            {isClosed ? "Close" : "Open"}
          </Button>
        </div>
      </div>
    </div>
  );
}
