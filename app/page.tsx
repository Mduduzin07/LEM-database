"use client";

import { Button } from "@/components/ui/button";
import { ArrowRightIcon } from "lucide-react";
import Link from "next/link";
import Dashboard from "./dashboard/page";
import { AuroraText } from "@/components/ui/aurora-text";
import { RainbowButton } from "@/components/ui/rainbow-button";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <div className="h-full flex flex-col">
      <div className="h-full flex">
        {/* Left Section */}
        <div className="hidden sm:flex w-1/3 border-r border-black/10 items-center justify-center bg-white">
          <img src="/logo.jpeg" className="w-72 object-contain" alt="Logo" />
        </div>

        {/* Right Section */}
        <div className="md:w-2/3 flex items-center justify-center bg-linear-to-br from-white to-amber-700">
          <div className="text-center space-y-8 max-w-2xl px-6">
            <h1 className="text-4xl sm:text-6xl font-bold leading-tight flex flex-col">
              Church Management <AuroraText>Simplified</AuroraText>
            </h1>

            <p className="text-lg sm:text-lg text-slate-900">
              Manage members, events, offerings and church operations from one
              powerful and secure platform.
            </p>

            <Link href="/sign-up">
              <RainbowButton
                className="
              text-xs
              sm:px-8 py-6
              bg-linear-to-t from-black/90 to-amber-600
              text-white sm:text-lg
              shadow-[0_2px_30px_rgba(0,0,0,0.4)]
              transition-all duration-300
              hover:-translate-y-1
              hover:shadow-xl
            "
              >
                Get Started <ArrowRightIcon className="ml-2" />
              </RainbowButton>
            </Link>
          </div>
        </div>
      </div>
      <div className="">
        <Footer />
      </div>
    </div>
  );
}
