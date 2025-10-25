"use client";
import Logo from "./Logo";
import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AddNew from "./addNew";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SignIn from "./SignIn";
import { useEffect, useState } from "react";
import SignUp from "./SignUp";
import { authClient } from "@/app/lib/auth-client";
import { Link, Loader2, LogOut, Settings } from "lucide-react";
import { BiQuestionMark } from "react-icons/bi";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const loggedIn = !!session?.user;
  const [signIn, setSignIn] = useState(false);
  useEffect(() => {
    if (session) {
      console.log("we have session:", session);
    }
  }, [session, isPending]);

  const handleLogout = async () => {
    await authClient.signOut();
    console.log("User logged out");
  };

  return (
    <div className="sticky top-0 left-0 backdrop:blur-2xl backdrop-blur-2xl z-100 flex justify-between items-center p-2">
      <Logo />

      <div className="flex items-center gap-8 md:gap-4">
        {isPending ? (
          <Loader2 size={16} className="animate-spin" />
        ) : loggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Avatar className="cursor-pointer">
                <AvatarImage
                  src={session?.user.image || "/profilePicture2.png"}
                  alt={session?.user.name || "User"}
                />
                <AvatarFallback>
                  {session?.user.name?.charAt(0) || "QL"}
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="center"
              className="bg-background/60 backdrop-blur-md z-200"
            >
              <DropdownMenuLabel>
                {session?.user.name || "My Account"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/links")}>
                <Link /> My Links
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => router.push("/my-questions")}>
                <BiQuestionMark /> My Questions
              </DropdownMenuItem>

              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => router.push("/settings")}>
                <Settings /> Settings
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout} className="text-red-500">
                <LogOut /> Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button>Log In</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] px-10">
                <div className="flex  items-center mb-4">
                  <span className="text-sm text-muted-foreground">
                    {signIn
                      ? "Don't have an account?"
                      : "Already have an account?"}
                  </span>
                  <Button
                    variant="link"
                    className="text-sm"
                    onClick={() => setSignIn(!signIn)}
                  >
                    {signIn ? "Sign Up here" : "Sign In here"}
                  </Button>
                </div>
                {signIn ? <SignIn /> : <SignUp />}
              </DialogContent>
            </form>
          </Dialog>
        )}
        <ModeToggle />
        <AddNew />
      </div>
    </div>
  );
}
