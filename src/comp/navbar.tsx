import Logo from "./Logo";
import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddNew from "./addNew";

export default function Navbar() {
  const loggedIn = true;
  return (
    <div className="flex justify-between items-center px-2">
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
