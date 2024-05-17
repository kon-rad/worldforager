import Link from "next/link";
import { UserAuthForm } from "./components/user-auth-form";

export default function AuthenticationPage() {
  const bgImageNum = Math.floor(Math.random() * 7) + 1;
  return (
    <>
      <div className="container md:grid lg:max-w-none md:grid-cols-2 md:px-0">
        <div
          className="container relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0"
          style={{
            backgroundImage: `url(${`/assets/images/agents-${bgImageNum}.png`})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        ></div>
        <div className="flex flex-col justify-center lg:p-8 min-h-[100vh]">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Login to your Account
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email below to login with magic link
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms-of-service"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy-policy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
