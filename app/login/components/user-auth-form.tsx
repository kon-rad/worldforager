"use client";

import * as React from "react";

import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { FaGoogle } from "react-icons/fa";
import { FaApple } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { useToast } from "@/components/ui/use-toast";

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isLoadingGoogle, setIsLoadingGoogle] = React.useState<boolean>(false);
  const [localEmail, setLocalEmail] = React.useState("");
  const { data: session } = useSession();
  const { toast } = useToast();

  if (session && session?.user?.id) {
    redirect("/studio");
  }

  const handleSignin = async (provider: string) => {
    setIsLoadingGoogle(true);

    const resp = await signIn(provider);

    setIsLoadingGoogle(false);
  };

  const handleMagicLink = async () => {
    setIsLoading(true);
    const resp = await signIn("email", { email: localEmail });
    toast({
      title: "Login Email Sent",
      description: "Check your email and look in spam",
    });
    setIsLoading(false);
  };

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <div className="grid gap-2">
        <div className="grid gap-1">
          <Label className="sr-only" htmlFor="email">
            Email
          </Label>
          <Input
            id="email"
            placeholder="name@example.com"
            type="email"
            autoCapitalize="none"
            autoComplete="email"
            autoCorrect="off"
            disabled={isLoading}
            value={localEmail}
            onChange={(e: any) => setLocalEmail(e.target.value)}
          />
        </div>
        <Button disabled={isLoading} onClick={handleMagicLink}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Sign In with Email
        </Button>
      </div>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Or continue with
          </span>
        </div>
      </div>
      <Button
        variant="outline"
        type="button"
        disabled={isLoadingGoogle}
        onClick={() => handleSignin("google")}
        className=""
      >
        {isLoadingGoogle ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FaGoogle className="mr-2 h-4 w-4" />
        )}{" "}
        Google
      </Button>
      {/* <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={() => handleSignin("apple")}
        className=""
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FaApple className="mr-2 h-4 w-4" />
        )}{" "}
        Apple
      </Button>
      <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={() => handleSignin("facebook")}
        className=""
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <FaFacebook className="mr-2 h-4 w-4" />
        )}{" "}
        Facebook
      </Button> */}
      {/* <Button
        variant="outline"
        type="button"
        disabled={isLoading}
        onClick={() => handleSignin("github")}
        className=""
      >
        {isLoading ? (
          <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <Icons.gitHub className="mr-2 h-4 w-4" />
        )}{" "}
        Github
      </Button> */}
    </div>
  );
}
