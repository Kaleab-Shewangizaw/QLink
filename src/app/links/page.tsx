"use client";

import LinkComp from "@/comp/linkComp";
import { useEffect, useState } from "react";

export default function MyLinksPage() {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
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
    <div>
      <h1>My Links</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {links.map((link) => (
            <LinkComp key={link._id} link={link} />
          ))}
        </ul>
      )}
    </div>
  );
}
