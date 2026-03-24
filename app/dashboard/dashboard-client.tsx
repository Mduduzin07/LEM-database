"use client";

import React from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarProvider,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuroraText } from "@/components/ui/aurora-text";

import {
  LayoutDashboard,
  Users,
  Calendar,
  DollarSign,
  ChurchIcon,
  CrownIcon,
  UserPlus,
  UsersRound,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// Warp background component (dynamic to prevent SSR issues)
const WarpBackground = dynamic(
  () => import("@/components/ui/warp-background").then((m) => m.WarpBackground),
  { ssr: false }
);

// Props type
type Props = {
  stats: {
    totalMembers: number;
    newMembersThisMonth: number;
  };
  gatherings: any[];
  gatheringStats: {
    totalGatherings: number;
    gatheringsThisMonth: number;
  };
  memberGrowth: {
    month: string;
    count: number;
  }[];
};

export default function DashboardClient({
  stats,
  gatherings,
  gatheringStats,
  memberGrowth,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();

  const currentMonth = new Date().toLocaleString("default", { month: "long" });

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar className="border-r h-full w-64 shrink-0">
          <SidebarHeader>
            <h2 className="text-xl font-bold">Church Admin</h2>
          </SidebarHeader>

          <SidebarContent className="ml-2">
            <SidebarMenu>
              <SidebarMenuItem
                onClick={() => router.push("/dashboard")}
                className={pathname === "/dashboard" ? "bg-amber-500 text-black" : ""}
              >
                <LayoutDashboard className="h-4 w-4" /> Dashboard
              </SidebarMenuItem>

              <SidebarMenuItem
                onClick={() => router.push("/dashboard/members")}
                className={pathname === "/dashboard/members" ? "bg-amber-500 text-black" : ""}
              >
                <Users className="h-4 w-4" /> Members
              </SidebarMenuItem>

              <SidebarMenuItem
                onClick={() => router.push("/dashboard/gatherings")}
                className={pathname === "/dashboard/gatherings" ? "bg-amber-500 text-black" : ""}
              >
                <Calendar className="h-4 w-4" /> Gatherings
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter>
            <img className="w-32 rounded-full" src="/logo.jpeg" />
          </SidebarFooter>
        </Sidebar>

        {/* Main Content */}
        <WarpBackground className="flex-1 p-6 overflow-y-auto">
          {/* Header */}
          <div className="mb-6">
            <AuroraText className="text-4xl font-bold">Dashboard</AuroraText>
            <p className="text-sm text-muted-foreground">
              Welcome to the church management system
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Members"
              value={stats.totalMembers}
              icon={<UsersRound className="h-5 w-5 text-amber-600" />}
            />
            <StatCard
              title="New Members"
              value={stats.newMembersThisMonth}
              icon={<UserPlus className="h-5 w-5 text-green-600" />}
              subtitle={`Joined this month (${currentMonth})`}
            />
            <StatCard
              title="Total Gatherings"
              value={gatheringStats.totalGatherings}
              icon={<Calendar className="h-5 w-5 text-blue-600" />}
            />
            <StatCard
              title="This Month"
              value={gatheringStats.gatheringsThisMonth}
              icon={<Calendar className="h-5 w-5 text-purple-600" />}
            />
          </div>

          {/* Member Growth Chart */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Member Growth</CardTitle>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={memberGrowth}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="count" stroke="#F59E0B" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Gatherings */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Recent Gatherings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {gatherings.slice(0, 5).map((g) => (
                <div
                  key={g._id}
                  className="flex justify-between border p-3 rounded-lg"
                >
                  <div>
                    <p className="font-medium">{g.eventName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(g.date).toLocaleDateString()} • {g.location}
                    </p>
                  </div>
                  <span className="text-xs font-semibold">
                    {g.eventStatus.replace("Event", "")}
                  </span>
                </div>
              ))}
            </CardContent>
          </Card>
        </WarpBackground>
      </div>
    </SidebarProvider>
  );
}

// StatCard Component 
function StatCard({
  title,
  value,
  icon,
  subtitle,
}: {
  title: string;
  value: number;
  icon?: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <Card className="cursor-pointer hover:shadow-lg transition border-l-4 border-amber-500">
      <CardContent>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
          {icon}
        </div>
        <p className="text-2xl font-bold mt-2">{value}</p>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
      </CardContent>
    </Card>
  );
}