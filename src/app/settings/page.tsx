"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Settingspage() {
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState("");
  const [image, setImage] = useState("");

  const router = useRouter();
  return (
    <div className="px-2 pb-5 flex flex-col">
      <div className="sticky top-13 z-10 bg-white dark:bg-[#0a0a0a] p-2 left-0  text-gray-500 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="hover:text-gray-300 cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft /> Back
        </button>
        <h2 className="text-lg font-semibold">Settings</h2>
        <Button
          variant={editMode ? "default" : "outline"}
          size={"sm"}
          onClick={() => setEditMode(!editMode)}
        >
          {editMode ? "Save" : "Edit"}
        </Button>
      </div>
    </div>
  );
}
