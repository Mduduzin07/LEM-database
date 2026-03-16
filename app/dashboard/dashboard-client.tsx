"use client"

import React from "react"
import { usePathname, useRouter } from "next/navigation"
import dynamic from "next/dynamic"

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarFooter,
} from "@/components/ui/sidebar"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { AuroraText } from "@/components/ui/aurora-text"

import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  Church,
  Network
} from "lucide-react"

const WarpBackground = dynamic(
  () => import("@/components/ui/warp-background").then((m) => m.WarpBackground),
  { ssr: false }
)

type Props = {
  stats: {
    totalMembers: number
    newMembers: number
  }
}

export default function DashboardClient({ stats }: Props) {

  const pathname = usePathname()
  const router = useRouter()

  return (
    <SidebarProvider>
      <div className="flex w-full min-h-[calc(100vh-64px)]">

        {/* Sidebar */}
        <Sidebar className="border-r h-[calc(100vh-64px)] mt-18 w-64 shrink-0">

          <SidebarHeader >
            <h2 className="text-xl font-bold">Church Admin</h2>
          </SidebarHeader>

          <SidebarContent className="ml-2">
            <SidebarMenu>

              <SidebarMenuItem
                onClick={() => router.push("/dashboard")}
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer
                ${pathname === "/dashboard"
                  ? "bg-linear-to-r from-black via-amber-700 to-white text-gray-500 font-bold"
                  : "hover:bg-muted"}`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </SidebarMenuItem>

              <SidebarMenuItem
                onClick={() => router.push("/dashboard/members")}
                className={`flex items-center gap-2 p-2 rounded-md cursor-pointer
                ${pathname === "/dashboard/members"
                  ? "bg-linear-to-r from-black via-amber-700 to-white text-gray-500 font-bold"
                  : "hover:bg-muted"}`}
              >
                <Users className="h-4 w-4" />
                Members
              </SidebarMenuItem>

              <SidebarMenuItem
                onClick={() => router.push("/dashboard/events")}
                className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted"
              >
                <Calendar className="h-4 w-4" />
                Events
              </SidebarMenuItem>

              <SidebarMenuItem
                onClick={() => router.push("/dashboard/offerings")}
                className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted"
              >
                <DollarSign className="h-4 w-4" />
                Offerings
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <img className="w-38 rounded-full" src="/logo.jpeg" alt="" />
          </SidebarFooter>

        </Sidebar>


        {/* Main Content */}
        <WarpBackground className="flex-1 p-8 pt-25 overflow-auto">

          <div className="mb-8">
            <AuroraText className="text-3xl font-bold">
              Dashboard
            </AuroraText>
            <p className="text-muted-foreground">
              Welcome to the church management system
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

            <Card>
              <CardContent className="p-6">
                <CardTitle>Total Members</CardTitle>
                <p className="text-3xl font-bold mt-2">
                  {stats.totalMembers}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <CardTitle>New Members</CardTitle>
                <p className="text-3xl font-bold mt-2">
                  {stats.newMembers}
                </p>
              </CardContent>
            </Card>

          </div>

        </WarpBackground>

      </div>
    </SidebarProvider>
  )
}