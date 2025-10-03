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
      <div className="p-4">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={!editMode}
            className={`w-full border p-2 rounded ${
              editMode
                ? "border-blue-500 focus:border-blue-700"
                : "bg-gray-100 cursor-not-allowed"
            }`}
            placeholder="Enter your name"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">
            Profile Image URL
          </label>
          <input
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            disabled={!editMode}
            className={`w-full border p-2 rounded ${
              editMode
                ? "border-blue-500 focus:border-blue-700"
                : "bg-gray-100 cursor-not-allowed"
            }`}
            placeholder="Enter image URL"
          />
        </div>
        {image && (
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Preview</label>
            <Image
              src={image}
              alt="Profile Preview"
              className="w-32 h-32 object-cover rounded-full border"
            />
          </div>
        )}
      </div>
    </div>
  );
}
