import { LogIn, User } from "lucide-react";
import Logo from "./Logo";
import { ModeToggle } from "@/components/modeToggle";

export default function Navbar() {
  const loggedIn = false;
  return (
    <div className="flex justify-between items-center">
      <Logo />
      <div className="font-bold">Questions</div>
      <div>
        <div className="text-black hover:text-blue-700 transition-all duration-200 cursor-pointer p-1 rounded-full bg-gray-200 flex items-center justify-center">
          {loggedIn ? <User /> : <LogIn />}
        </div>
        <ModeToggle />
      </div>
    </div>
  );
}
