"use client";

import LinkComp from "@/comp/linkComp";
import { ILink } from "@/lib/models/LinkModel";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyLinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this link?")) return;
    try {
      const res = await fetch(`/api/link/delete-link/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setLinks((prev) => prev.filter((link: ILink) => link._id !== id));
      } else {
        console.error("Failed to delete link");
      }
    } catch (error) {
      console.error("Error deleting link:", error);
    }
  };

  useEffect(() => {
    const fetchLinks = async () => {
      setLoading(true);
      const res = await fetch("/api/link/my-links");
      if (res.ok) {
        const data = await res.json();
        setLinks(data.links);
      }
      setLoading(false);
    };
    fetchLinks();
  }, []);

  return (
    <div className="md:p-2">
      <div className="sticky top-12 z-10 bg-white dark:bg-[#0a0a0a] p-2 left-0  text-gray-500 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="hover:text-gray-300 cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft /> Back
        </button>
      </div>
      <h1 className="text-2xl font-bold mt-4">My Links</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {links.map((link: ILink) => (
            <LinkComp
              key={link._id}
              link={link}
              onDelete={() => handleDelete(link._id)}
            />
          ))}
        </ul>
      )}
    </div>
  );
}
