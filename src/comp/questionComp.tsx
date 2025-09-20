import { User } from "lucide-react";
import Link from "next/link";

function Top() {
  return (
    <div className="w-full flex justify-between">
      <div className="flex itesm-center text-gray-300 gap-2 hover:text-blue-700">
        <div className="text-black  transition-all duration-200 cursor-pointer p-1 text-xs rounded-full bg-gray-200 flex items-center justify-center">
          <User size={20} />
        </div>

        <p className=" text-sm  flex items-center ">
          <Link href="" className="">
            username{" "}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function QuestionComp() {
  return (
    <div className="w-full px-1 py-2 border border-gray-400">
      <Top />
    </div>
  );
}
