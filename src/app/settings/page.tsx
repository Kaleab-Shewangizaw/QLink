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
      <div>
        <div className="flex flex-col items-center mt-5 gap-3">
          <div className="relative w-32 h-32">
            <Image
              src={
                image ||
                "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y"
              }
              alt="Profile Picture"
              width={128}
              height={128}
              className="rounded-full object-cover"
            />
            {editMode && (
              <input
                type="file"
                accept="image/*"
                className="absolute bottom-0 right-0 bg-gray-200 bg-opacity-75 rounded-full p-1 cursor-pointer"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setImage(reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            )}
          </div>
          <div className="flex flex-col items-center">
            {editMode ? (
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="border border-gray-300 rounded px-2 py-1"
              />
            ) : (
              <h3 className="text-xl font-medium">{name || "Your Name"}</h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
