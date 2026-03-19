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
  ChurchIcon,
  CrownIcon,
  UserPlus,
  UsersRound
} from "lucide-react"
import { redirect } from "next/navigation"

const WarpBackground = dynamic(
  () => import("@/components/ui/warp-background").then((m) => m.WarpBackground),
  { ssr: false }
)

type Props = {
  stats: {
    totalMembers: number
    newMembersThisMonth: number
  }
}

export default function DashboardClient({ stats }: Props) {

  const pathname = usePathname()
  const router = useRouter()

  // Provide default values in case stats is partially undefined
  const safeStats = {
    totalMembers: stats?.totalMembers ?? 0,
    newMembersThisMonth: stats?.newMembersThisMonth ?? 0
  }

  const currentMonth = new Date().toLocaleString('default', { month: 'long' })

  return (
    <SidebarProvider>
      <div className="flex w-full overflow-y-auto h-screen">

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
              
              <SidebarMenuItem
                onClick={() => router.push("/dashboard/pastors")}
                className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted"
              >
                <ChurchIcon className="h-4 w-4" />
                Pastors
              </SidebarMenuItem>
              
              <SidebarMenuItem
                onClick={() => router.push("/dashboard/hod")}
                className="flex items-center gap-2 p-2 rounded-md cursor-pointer hover:bg-muted"
              >
                <CrownIcon className="h-4 w-4" />
                Head of Department
              </SidebarMenuItem>

            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <img className="w-38 rounded-full" src="/logo.jpeg" alt="Church Logo" />
          </SidebarFooter>

        </Sidebar>

        {/* Main Content */}
        <WarpBackground className="flex-1 p-8 pt-25">

          <div className="mb-8">
            <AuroraText className="text-4xl font-bold sm:text-3xl sm:font-bold">
              Dashboard
            </AuroraText>
            <p className="text-xl text-muted-foreground">
              Welcome to the church management system
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            
            {/* Card 1: Total Members */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-amber-600">
              <CardContent className="p-6" onClick={()=>redirect("/dashboard/members")}>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    TOTAL MEMBERS
                  </CardTitle>
                  <UsersRound className="h-5 w-5 text-amber-600" />
                </div>
                <p className="text-3xl font-bold mt-2">
                  {safeStats.totalMembers.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  All registered members
                </p>
              </CardContent>
            </Card>

            {/* Card 2: New Members This Month */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-l-green-600">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    NEW MEMBERS
                  </CardTitle>
                  <UserPlus className="h-5 w-5 text-green-600" />
                </div>
                <p className="text-3xl font-bold mt-2">
                  {safeStats.newMembersThisMonth.toLocaleString()}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    Total number of members joined this month of <span className="font-bold">{currentMonth}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          

            {/* Placeholder Cards */}
            <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    UPCOMING EVENTS
                  </CardTitle>
                </div>
                <p className="text-2xl font-bold mt-2 text-muted-foreground">
                  0
                </p>
              </CardContent>
            </Card>

            <Card className="cursor-pointer hover:shadow-lg transition-shadow opacity-50">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    OFFERINGS
                  </CardTitle>
                </div>
                <p className="text-2xl font-bold mt-2 text-muted-foreground">
                  R0
                </p>
              </CardContent>
            </Card>

          </div>

        </WarpBackground>

      </div>
    </SidebarProvider>
  )
}