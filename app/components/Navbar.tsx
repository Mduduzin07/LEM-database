"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { useSession } from "@/lib/auth/auth-client";
import Link from "next/link";
import React from "react";
import SignOutButton from "./sign-out-btn";

export default function Navbar() {
  const { data: session, isPending } = useSession();
  return (
    <nav
      className="
      sticky top-0 z-50
      h-16
      backdrop-blur-md
      bg-slate-950/70
      border-b border-white/10
      shadow-[0_4px_30px_rgba(0,0,0,0.4)]
      flex items-center justify-between
      bg-linear-to-tr from-black via-white to-amber-500
    "
    >
      {/* Logo */}
      <div className="flex items-center pl-5">
        <Link href="/">
          <img
            className="w-10 sm:w-12 mr-4 rounded-full"
            src="/colorLogo.jpeg"
            alt="LEM ministries"
          />
        </Link>

        <p className="text-sm sm:text-base font-bold text-black">
          LEM ministries
        </p>
      </div>

      {session?.user ? (
        <div className="flex items-center mr-10">
          <Link href="/dashboard">
            <Button
              className="cursor-pointer mr-4 text-gray-700 hover:text-black"
              variant="ghost"
            >
              Dashboard
            </Button>
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full cursor-pointer"
              >
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="text-black">
                    {session.user.name[0].toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {session.user.name}
                  </p>
                  <p className="text-xs leading-none text-muted-foreground">
                    {session.user.email}
                  </p>
                </div>
              </DropdownMenuLabel>
              <SignOutButton />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <div className="mr-6 flex items-center gap-3">
          <Link href="/sign-in">
            <Button
              variant="ghost"
              className="
            rounded-full
            px-5 py-2
            text-sm
            transition-all duration-300
            hover:-translate-y-0.5
          "
            >
              Login
            </Button>
          </Link>

          <Link href="/sign-up">
            <RainbowButton
              className="
            hidden sm:inline-flex
            px-5 py-2
            text-sm
            transition-all duration-300
            hover:-translate-y-0.5
          "
            >
              Sign up
            </RainbowButton>
          </Link>
        </div>
      )}
    </nav>
  );
}
