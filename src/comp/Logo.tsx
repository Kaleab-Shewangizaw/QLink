import Link from "next/link";

export default function Logo() {
  return (
    <Link href={"/"}>
      <div className="bg-gradient-to-r cursor-pointer from-blue-600 to-blue-400 text-white font-bold px-3 py-1 rounded-xl text-sm shadow-md  select-none">
        QLink
      </div>
    </Link>
  );
}
