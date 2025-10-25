import type { Metadata } from "next";
import { ReactNode } from "react";

interface LinkLayoutProps {
  children: ReactNode;
  params: { id: string; name: string };
}

// ✅ generateMetadata gets a plain object (not Promise) here
export async function generateMetadata({
  params,
}: {
  params: { id: string; name: string };
}): Promise<Metadata> {
  const { id } = params;

  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "https://qlink.vercel.app";

  try {
    const res = await fetch(`${baseUrl}/api/link/get-link/${id}`, {
      next: { revalidate: 60 },
    });

    if (!res.ok) throw new Error("Link not found");

    const data = await res.json();
    const link = data.link;

    const title = link?.name || "Ask me anything";
    const description =
      "Ask me a question anonymously or share your thoughts through QLink.";
    const image = link?.image || `${baseUrl}/og-default.png`;
    const url = `${baseUrl}/link/${id}/${encodeURIComponent(
      link?.name || "link"
    )}`;

    return {
      title: `${title} | QLink`,
      description,
      metadataBase: new URL(baseUrl),
      openGraph: {
        title,
        description,
        url,
        siteName: "QLink - Create and share your questionaries",
        images: [
          {
            url: image,
            width: 1200,
            height: 630,
            alt: title,
          },
        ],
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [image],
      },
    };
  } catch (error) {
    console.error("Metadata generation error:", error);
    return {
      title: "QLink - Ask and share questions",
      description: "Create and share your questionaries easily with QLink.",
      openGraph: {
        title: "QLink - Ask and share questions",
        siteName: "QLink",
        images: [
          {
            url: `${baseUrl}/og-default.png`,
            width: 1200,
            height: 630,
          },
        ],
        type: "website",
      },
    };
  }
}

export default function LinkLayout({ children }: LinkLayoutProps) {
  return <>{children}</>;
}
