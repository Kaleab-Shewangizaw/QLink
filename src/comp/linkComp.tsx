import Link from "next/link";

export default function LinkComp({ link }: { link: any }) {
  return (
    <div>
      <Link href={`/link/${link._id}/${link.name}`}>{link.name}</Link>
    </div>
  );
}
