"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { WarpBackground } from "@/components/ui/warp-background";
import { signIn } from "@/lib/auth/auth-client";
import { Mail, Lock } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { ShineBorder } from "@/components/ui/shine-border";
import { Input } from "@/components/ui/input";
import toast from "react-hot-toast";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  function validateEmail(email: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address";
    }
    return null;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      setLoading(false);
      return;
    }

    try {
      const result = await signIn.email({
        email,
        password,
      });

      if (result.error) {
        setError(result.error.message ?? "Failed to sign in");
        toast.error(result.error.message ?? "Failed to sign in");
      } else {
        toast.success("Login successful!");
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      toast.error("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    router.prefetch("/dashboard");
  }, [router]);

  const theme = useTheme();
  return (
    <WarpBackground className="flex items-center justify-center min-h-screen px-3 sm:px-4 py-6 sm:py-10">
      <Card className="w-full max-w-md sm:max-w-lg shadow-2xl border-white/10 backdrop-blur-xl bg-white/95">
        <ShineBorder shineColor={theme.theme === "dark" ? "white" : "black"} />
        <CardHeader className="space-y-2 sm:space-y-3 px-4 sm:px-6">
          <CardTitle className="text-xl sm:text-2xl md:text-3xl font-bold text-center">
            Welcome back
          </CardTitle>
          <p className="text-center text-muted-foreground text-xs sm:text-sm">
            Enter your credentials to access your account
          </p>
        </CardHeader>

        <CardContent className="flex justify-center px-4 sm:px-6">
          <form onSubmit={handleSubmit} className="space-y-5 sm:space-y-6 w-full">
            <div className="space-y-1 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  type="email"
                  placeholder="Enter your email"
                  required
                  className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base
                  rounded-lg sm:rounded-xl border border-slate-200
                  focus:outline-none focus:ring-2 focus:ring-amber-500
                  transition-all"
                />
              </div>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label className="text-xs sm:text-sm font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-muted-foreground" />
                <Input
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  type="password"
                  placeholder="Enter your password"
                  minLength={8}
                  required
                  className="w-full pl-9 sm:pl-12 pr-3 sm:pr-4 py-3 sm:py-4 text-sm sm:text-base
                  rounded-lg sm:rounded-xl border border-slate-200
                  focus:outline-none focus:ring-2 focus:ring-amber-500
                  transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <Button
              className="w-full text-sm sm:text-sm cursor-pointer
              bg-linear-to-r from-black to-amber-600
              hover:opacity-90 transition-all
              shadow-lg hover:shadow-xl rounded-lg sm:rounded-xl"
            >
              {loading ? (
                <span className="flex text-sm">
                  <Spinner className="mr-1" /> Logging in...
                </span>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex justify-center px-4 sm:px-6 text-xs sm:text-sm">
          <p className="text-center">
            Don't have an account?{" "}
            <Link href="/sign-up">
              <span className="text-amber-600 font-semibold hover:underline cursor-pointer">
                Sign up
              </span>
            </Link>
          </p>
        </CardFooter>
      </Card>
    </WarpBackground>
  );
}