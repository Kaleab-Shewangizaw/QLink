"use client";

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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, Copy, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddNew() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const link = "https://qlink.ai/your-link";
  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">
          <PlusIcon size={16} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="bg-background/60 backdrop-blur-md z-200"
      >
        <Dialog open={open} onOpenChange={setOpen}>
          <form>
            <DialogTrigger asChild>
              <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                Link
              </DropdownMenuItem>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create a Link</DialogTitle>
                <DialogDescription>
                  create a link to share with others. to ask you questions
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Name*</Label>
                  <Input required id="name-1" />
                </div>
                <div className="flex items-center justify-between w-full max-w-md rounded-md border bg-muted px-3 py-2 font-inter text-sm">
                  <span className="truncate">{link}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="ml-2"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit">Save changes</Button>
              </DialogFooter>
            </DialogContent>
          </form>
        </Dialog>

        <DropdownMenuItem onSelect={() => router.push("/new-question")}>
          Question
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
