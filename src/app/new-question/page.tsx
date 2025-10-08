"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ImageIcon, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewQuestion() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newFiles = Array.from(files);
      setImages((prev) => [...prev, ...newFiles]);
      newFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  async function convertImagesToBase64(files: File[]): Promise<string[]> {
    return Promise.all(
      files.map(
        (file) =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result as string);
            reader.onerror = reject;
            reader.readAsDataURL(file);
          })
      )
    );
  }

  const router = useRouter();

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      const imagesBase64 = await convertImagesToBase64(images.slice(0, 4));
      const res = await fetch("/api/question/add-question", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          isAnonymous,
          images: imagesBase64,
        }),
      });

      if (res.ok) {
        router.push("/");
        setLoading(false);
      } else {
        console.error("Failed to submit question");
        setLoading(false);
      }
    } catch (error) {
      console.error("An error occurred:", error);
      setLoading(false);
    }
  };

  return (
    <div className="p-2 py-5 flex flex-col">
      <button
        onClick={() => router.back()}
        className="text-gray-500 mb-5 hover:text-gray-300 cursor-pointer flex items-center gap-1 w-fit"
      >
        <ArrowLeft /> Back
      </button>
      <div className="border border-gray-700 rounded-md p-4 text-center">
        <form onSubmit={handleSubmit}>
          <h1 className="text-lg font-semibold">New Question</h1>
          <div className="flex items-end gap-4 flex-wrap">
            {imagePreviews.map((preview, idx) => (
              <div
                key={idx}
                className="relative w-34 h-34 rounded-sm overflow-hidden"
              >
                <Image
                  src={preview}
                  alt={`Preview ${idx + 1}`}
                  layout="fill"
                  objectFit="cover"
                />
                <X
                  className="absolute top-0 right-0 cursor-pointer bg-black bg-opacity-50 rounded-full"
                  onClick={() => handleRemoveImage(idx)}
                  size={18}
                />
              </div>
            ))}
            <div className="flex items-center gap-2 w-full">
              {images.length < 4 && (
                <Label
                  htmlFor="images"
                  className="w-fit flex text-gray-400 hover:text-gray-200 cursor-pointer ml-auto border p-2 rounded-md"
                >
                  <ImageIcon />
                  add images
                </Label>
              )}
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>
          <div className="grid gap-4 py-5">
            <div className="grid gap-2">
              <Label className="mt-4">
                Your Question*{" "}
                <span className="text-gray-400 font-normal">
                  250 characters
                </span>
              </Label>
              <Textarea
                maxLength={250}
                required
                rows={3}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center justify-between mt-5">
            <div className="flex items-center gap-2">
              <Checkbox
                id="anonymous"
                checked={isAnonymous}
                onCheckedChange={(checked) => setIsAnonymous(checked === true)}
              />
              <Label htmlFor="anonymous">Ask Anonymously </Label>
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                type="button"
                onClick={() => router.back()}
              >
                Cancel
              </Button>
              <Button variant="outline" type="submit" disabled={loading}>
                {loading ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
