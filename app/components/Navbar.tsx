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
import { signOut, useSession } from "@/lib/auth/auth-client";
import Link from "next/link";
import React, { useState } from "react";
import { MenuIcon, SidebarClose } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { Luckiest_Guy } from "next/font/google";

const luckiest = Luckiest_Guy({
  subsets: ["latin"],
  weight: "400",
});

export default function Navbar() {
  const { data: session, isPending } = useSession();
  const [showSidebar, setShowSidebar] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const linkClass = (path: string) =>
    `cursor-pointer border-b px-2 py-2 rounded transition 
     ${
       pathname === path
         ? "bg-amber-500 text-black font-semibold"
         : "hover:bg-slate-600 hover:text-white"
     }`;

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
  };

  return (
    <>
      {/* DARK OVERLAY */}
      {showSidebar && (
        <div
          onClick={() => setShowSidebar(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        />
      )}

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
        <div className="hidden sm:flex items-center pl-5">
          <Link href="/">
            <img
              className="w-10 sm:w-12 mr-4 rounded-full"
              src="/colorLogo.jpeg"
              alt="LEM ministries"
            />
          </Link>

          <p
            className={`${luckiest.className} hidden text-sm sm:flex sm:text-base font-bold text-black`}
          >
            LEM ministries
          </p>
        </div>
        <MenuIcon
          onClick={() => setShowSidebar(true)}
          className="text-black ml-4 size-6 md:hidden"
        />

        <div
          className={`fixed top-0 left-0 h-screen w-60 bg-linear-to-tl from-black via-amber-700/90 to-black text-white p-6 transform transition-transform duration-300
        ${showSidebar ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between mb-3">
            <p className={`${luckiest.className} font-bold`}>LEM Ministries</p>

            <SidebarClose
              className="cursor-pointer"
              onClick={() => setShowSidebar(false)}
            />
          </div>

          <div className="flex flex-col gap-4">
            <Link
              onClick={() => setShowSidebar(false)}
              className={`border-b ${linkClass("/dashboard")}`}
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              onClick={() => setShowSidebar(false)}
              className={`border-b ${linkClass("/dashboard/members")}`}
              href="/dashboard/members"
            >
              Members
            </Link>
            <Link
              onClick={() => setShowSidebar(false)}
              className={`border-b ${linkClass("/dashboard/gatherings")}`}
              href="/dashboard/gatherings"
            >
              Events
            </Link>
            <Link
              onClick={() => setShowSidebar(false)}
              className={`border-b ${linkClass("/dashboard/offerings")}`}
              href="/dashboard/offerings"
            >
              Offerings
            </Link>
            <Link
              onClick={() => setShowSidebar(false)}
              className={`border-b ${linkClass("/dashboard/pastors")}`}
              href="/dashboard/pastors"
            >
              Pastors
            </Link>
            <Link
              onClick={() => setShowSidebar(false)}
              className={`border-b ${linkClass("/dashboard/hod")}`}
              href="/dashboard/hod"
            >
              Head of Departments
            </Link>
          </div>
        </div>

        {!isPending && session?.user ? (
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
                      {session.user.name?.[0]?.toUpperCase() || "U"}
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
                <Button
                  onClick={handleSignOut}
                  variant="ghost"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  Sign Out
                </Button>
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
    </>
  );
}