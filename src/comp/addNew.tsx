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
import { Check, Copy, Link, PlusIcon } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { BiQuestionMark } from "react-icons/bi";

export default function AddNew() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [link, setLink] = useState("Link will be generated here");
  const [created, setCreated] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      fetch("/api/link/add-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
        }),
      }).then((res) => {
        if (res.ok) {
          res.json().then((data) => {
            setLink(
              `${window.location.origin}/link/${data.link._id}/${data.link.name}`
            );
            setCreated(true);
            setLoading(false);
          });
        } else {
          res.json().then((data) => {
            alert(data.message);
            setLoading(false);
          });
        }
      });
    } catch (error) {
      console.error("Error adding link:", error);
    }
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
          <DialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Link /> Link
            </DropdownMenuItem>
          </DialogTrigger>

          <DialogContent className="sm:max-w-[525px]">
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Create a Link</DialogTitle>
                <DialogDescription>
                  create a link to share with others. to ask you questions
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 mb-5">
                <div className="grid gap-3">
                  <Label htmlFor="name-1">Name*</Label>
                  <Input
                    required
                    id="name-1"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <div className="flex items-center justify-between w-full max-w-md rounded-md border bg-muted px-3 py-2 text-sm">
                  <span className="truncate">{link}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    type="button"
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
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </DialogClose>
                {!created && (
                  <Button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create Link"}
                  </Button>
                )}
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        <DropdownMenuItem onSelect={() => router.push("/new-question")}>
          <BiQuestionMark /> Question
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
