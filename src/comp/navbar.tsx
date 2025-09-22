"use client";
import Logo from "./Logo";
import { ModeToggle } from "@/components/modeToggle";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import AddNew from "./addNew";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import SignIn from "./SignIn";
import { useState } from "react";
import SignUp from "./SignUp";

export default function Navbar() {
  const loggedIn = true;
  const [signIn, setSignIn] = useState(false);
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
          <Dialog>
            <form>
              <DialogTrigger asChild>
                <Button>Log In</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] px-10">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setSignIn(!signIn)}
                >
                  {signIn ? "Sign Up" : "Sign In"}
                </Button>
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
