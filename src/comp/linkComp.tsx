"use client";

import { Button } from "@/components/ui/button";
import { Check, Copy } from "lucide-react";

import Link from "next/link";
import { useState } from "react";

export default function LinkComp({ link }: { link: any }) {
  const [copied, setCopied] = useState(false);
  return (
    <div>
      <div className="w-full flex items-center justify-between  mt-4 shadow-md/10 dark:border rounded-md dark:border-gray-900 px-2 py-4 ">
        <div>
          <h1>
            <Link
              className="hover:underline mr-2 text-lg font-semibold cursor-pointer"
              href={`/link/${link._id}/${link.name}`}
            >
              {link.name}
            </Link>
            {link.isOpen ? (
              <span className="text-xs text-green-500">Open</span>
            ) : (
              <span className="text-xs text-red-500">Closed</span>
            )}
          </h1>
          <div className="text-sm text-gray-500">
            {link.questions.length} Questions
          </div>
        </div>
        <div className="text-sm text-gray-400">
          <Button
            size="sm"
            variant={"ghost"}
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
          <Button size="sm" variant={link.isOpen ? "destructive" : "default"}>
            {link.isOpen ? "Close" : "Open"}
          </Button>
        </div>
      </div>
    </div>
  );
}
