"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft, ImagePlus } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { authClient } from "../lib/auth-client";
import { Label } from "@/components/ui/label";

export default function Settingspage() {
  const { data: session } = authClient.useSession();
  const [editMode, setEditMode] = useState(false);
  const [name, setName] = useState(session?.user?.name || "");
  const [image, setImage] = useState(
    session?.user?.image || "/profilePicture2.png"
  );
  const [loading, setLoading] = useState(false);

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
          {editMode ? "Cancel" : "Edit"}
        </Button>
      </div>
      <div>
        <div className="flex flex-col items-center mt-5 gap-3">
          <div className="relative w-32 h-32">
            <Image
              src={image}
              alt="Profile Picture"
              fill
              className={`rounded-full object-cover ${editMode ? "" : ""}`}
            />
            {editMode && (
              <>
                <Label
                  htmlFor="file-input"
                  className="absolute bottom-0 right-0 h-32 w-32 bg-black/40 text-center flex items-center justify-center text-white rounded-full p-1 cursor-pointer"
                >
                  <ImagePlus />
                </Label>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
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
              </>
            )}
          </div>
          <div className="flex flex-col items-center">
            {editMode ? (
              <>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="border border-gray-300 rounded  placeholder:text-gray-400 focus:outline-none px-3 py-2"
                />
                <Button
                  disabled={loading}
                  variant={"outline"}
                  className="mt-5"
                  onClick={() => {
                    setEditMode(false);
                    setLoading(true);
                    fetch(`/api/user/update-user/${session?.user?.id}`, {
                      method: "PUT", // ✅ FIXED
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        name,
                        image,
                      }),
                    })
                      .then((res) => res.json())
                      .then((data) => {
                        if (data.success) {
                          setName(name);
                          setImage(image);
                          window.location.reload();
                        } else {
                          setName(session?.user?.name || "");
                          setImage(
                            session?.user?.image || "/profilePicture2.png"
                          );
                          console.error(
                            "Error updating user:",
                            data.message || data.error
                          );
                        }
                      })
                      .catch((err) => console.error("Request failed:", err))
                      .finally(() => {
                        setLoading(false);
                      });
                  }}
                >
                  Save
                </Button>
              </>
            ) : (
              <h3 className="text-xl font-medium">
                {name || session?.user?.name}
              </h3>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
