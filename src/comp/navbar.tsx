import Logo from "./Logo";
import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddNew from "./addNew";

export default function Navbar() {
  const loggedIn = true;
  return (
    <div className="sticky top-0 left-0 backdrop:blur-2xl backdrop-blur-2xl z-100 flex justify-between items-center p-2">
      <Logo />
      <div className="font-bold">Questions</div>
      <div className="flex items-center gap-4">
        {loggedIn ? (
          <Avatar>
            <AvatarImage src="/profilePicture2.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        ) : (
          <Button>Log In</Button>
        )}
        <ModeToggle />
        <AddNew />
      </div>
    </div>
  );
}
