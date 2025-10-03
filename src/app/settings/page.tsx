import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Settingspage() {
  const router = useRouter();
  return (
    <div className="px-2 pb-5 flex flex-col">
      <div className="sticky top-13 z-10 bg-white dark:bg-[#0a0a0a] p-2 left-0 border border-gray-700 border-b-0 text-gray-500 flex items-center justify-between">
        <button
          onClick={() => router.back()}
          className="hover:text-gray-300 cursor-pointer flex items-center gap-1"
        >
          <ArrowLeft /> Back
        </button>
      </div>
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        {/* Add your settings content here */}
      </div>
    </div>
  );
}
