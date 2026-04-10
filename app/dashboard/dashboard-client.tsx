"use client";

import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import toast from "react-hot-toast";

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
  UserPlus,
  UsersRound,
  TrendingUp,
  Wallet,
  Heart,
  Leaf,
  Gift,
  Target,
  RefreshCw,
  Menu,
  X,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
} from "recharts";

const WarpBackground = dynamic(
  () => import("@/components/ui/warp-background").then((m) => m.WarpBackground),
  { ssr: false }
);

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

interface OfferingData {
  _id: string;
  amount: number;
  type: string;
  date: string;
  memberName: string;
  note: string;
}

const COLORS = {
  tithe: "#8b5cf6",
  offering: "#ec4899",
  seed: "#10b981",
  pledge: "#f59e0b",
  thanksgiving: "#06b6d4",
};

export default function DashboardClient({
  stats,
  gatherings,
  gatheringStats,
  memberGrowth,
}: Props) {
  const pathname = usePathname();
  const router = useRouter();
  const [offerings, setOfferings] = useState<OfferingData[]>([]);
  const [offeringsLoading, setOfferingsLoading] = useState(true);
  const [offeringStats, setOfferingStats] = useState({
    total: 0,
    byType: {} as Record<string, number>,
    thisMonth: 0,
    average: 0,
  });
  const [monthlyOfferingData, setMonthlyOfferingData] = useState<any[]>([]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentMonth = new Date().toLocaleString("default", { month: "long" });
  const currentYear = new Date().getFullYear();

  // Fetch offerings data
  const fetchOfferings = async () => {
    try {
      setOfferingsLoading(true);
      const response = await fetch("/api/offerings");
      const data = await response.json();
      
      if (data.success) {
        setOfferings(data.data);
        
        // Calculate total stats
        const total = data.data.reduce((sum: number, o: OfferingData) => sum + o.amount, 0);
        const byType: Record<string, number> = {};
        const currentDate = new Date();
        let thisMonthTotal = 0;
        
        // Calculate monthly data dynamically
        const monthlyMap = new Map();
        
        data.data.forEach((offering: OfferingData) => {
          // By type
          byType[offering.type] = (byType[offering.type] || 0) + offering.amount;
          
          // This month
          const offeringDate = new Date(offering.date);
          if (offeringDate.getMonth() === currentDate.getMonth() && 
              offeringDate.getFullYear() === currentDate.getFullYear()) {
            thisMonthTotal += offering.amount;
          }
          
          // Dynamic monthly data
          const monthKey = `${offeringDate.getFullYear()}-${offeringDate.getMonth()}`;
          const monthName = offeringDate.toLocaleString('default', { month: 'short' });
          const existing = monthlyMap.get(monthKey) || { month: monthName, amount: 0, fullDate: offeringDate };
          existing.amount += offering.amount;
          monthlyMap.set(monthKey, existing);
        });
        
        // Convert to array and sort by date
        const monthlyData = Array.from(monthlyMap.values())
          .sort((a, b) => a.fullDate - b.fullDate)
          .slice(-6);
          
        setMonthlyOfferingData(monthlyData);
        
        setOfferingStats({
          total,
          byType,
          thisMonth: thisMonthTotal,
          average: data.data.length > 0 ? total / data.data.length : 0,
        });
      }
    } catch (error) {
      console.error("Error fetching offerings:", error);
      toast.error("Failed to load offering data");
    } finally {
      setOfferingsLoading(false);
    }
  };

  useEffect(() => {
    fetchOfferings();
  }, []);

  // Prepare chart data
  const pieChartData = Object.entries(offeringStats.byType).map(([name, value]) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value,
    type: name,
  }));

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: 'ZAR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  // Sidebar menu items
  const menuItems = [
    { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { name: "Members", path: "/dashboard/members", icon: Users },
    { name: "Gatherings", path: "/dashboard/gatherings", icon: Calendar },
    { name: "Offerings", path: "/dashboard/offerings", icon: DollarSign },
    { name: "Head of Departments", path: "/dashboard/hod", icon: ChurchIcon },
  ];

  return (
    <SidebarProvider>
      <div className="flex w-full h-screen overflow-hidden">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden lg:block ml-1 mt-16 border-r h-full w-64 shrink-0">
          <SidebarHeader>
            <h2 className="text-xl font-bold px-4">Church Admin</h2>
          </SidebarHeader>
          <SidebarContent className="ml-2">
            <SidebarMenu>
              {menuItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.path;
                return (
                  <SidebarMenuItem
                    key={item.path}
                    onClick={() => router.push(item.path)}
                    className={`flex items-center gap-2 cursor-pointer transition-all ${
                      isActive
                        ? "bg-amber-600 rounded-br-xl text-white"
                        : "text-black hover:bg-slate-200 hover:rounded-br-xl"
                    }`}
                  >
                    <Icon className="h-4 w-4 ml-3" />
                    <span className="py-2">{item.name}</span>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="pb-15">
            <div className="px-4">
              <img className="w-24 rounded-full mx-auto" src="/logo.jpeg" alt="Church Logo" />
            </div>
          </SidebarFooter>
        </Sidebar>

        {/* Mobile Sidebar Toggle */}
        <div className="lg:hidden fixed top-4 left-4 z-50">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 bg-white rounded-lg shadow-lg"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Sidebar */}
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/50" onClick={() => setMobileMenuOpen(false)}>
            <div className="fixed left-0 top-0 h-full w-64 bg-white shadow-xl z-50" onClick={(e) => e.stopPropagation()}>
              <div className="p-6">
                <h2 className="text-xl font-bold mb-6">Church Admin</h2>
                <div className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                      <div
                        key={item.path}
                        onClick={() => {
                          router.push(item.path);
                          setMobileMenuOpen(false);
                        }}
                        className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                          isActive
                            ? "bg-amber-600 text-white"
                            : "hover:bg-slate-100"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-8 pt-8 border-t">
                  <img className="w-20 rounded-full mx-auto" src="/logo.jpeg" alt="Church Logo" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Content - Dashboard */}
        <WarpBackground className="flex-1 overflow-y-auto pb-20">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <AuroraText className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                  Dashboard
                </AuroraText>
                <p className="text-sm text-muted-foreground mt-1">
                  Welcome to the church management system
                </p>
              </div>
              <button
                onClick={fetchOfferings}
                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                title="Refresh data"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>

            {/* Stats Cards - Members & Gatherings */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <StatCard
                onClick={() => router.push("/dashboard/members")}
                title="Total Members"
                value={stats.totalMembers}
                icon={<UsersRound className="h-5 w-5 text-amber-600" />}
              />
              <StatCard
                onClick={() => router.push("/dashboard/members/add-member")}
                title="New Members"
                value={stats.newMembersThisMonth}
                icon={<UserPlus className="h-5 w-5 text-green-600" />}
                subtitle={`Joined this month (${currentMonth})`}
              />
              <StatCard
                onClick={() => router.push("/dashboard/gatherings")}
                title="Total Gatherings"
                value={gatheringStats.totalGatherings}
                icon={<Calendar className="h-5 w-5 text-blue-600" />}
              />
              <StatCard
                title="Gatherings This Month"
                value={gatheringStats.gatheringsThisMonth}
                icon={<Calendar className="h-5 w-5 text-purple-600" />}
              />
            </div>

            {/* Offering Stats Cards */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6">
              <StatCard
                onClick={() => router.push("/dashboard/offerings")}
                title="Total Offerings"
                value={formatCurrency(offeringStats.total)}
                icon={<Wallet className="h-5 w-5 text-emerald-600" />}
                subtitle="All time"
              />
              <StatCard
                onClick={() => router.push("/dashboard/offerings")}
                title="This Month"
                value={formatCurrency(offeringStats.thisMonth)}
                icon={<TrendingUp className="h-5 w-5 text-blue-600" />}
                subtitle={`${currentMonth} ${currentYear}`}
              />
              <StatCard
                title="Average Offering"
                value={formatCurrency(offeringStats.average)}
                icon={<DollarSign className="h-5 w-5 text-purple-600" />}
                subtitle="Per transaction"
              />
              <StatCard
                title="Transactions"
                value={offerings.length}
                icon={<Target className="h-5 w-5 text-orange-600" />}
                subtitle="Total offerings given"
              />
            </div>

            {/* Charts Section */}
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              {/* Member Growth Chart */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Member Growth Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-64 sm:h-72 lg:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={memberGrowth}>
                      <XAxis dataKey="month" fontSize={12} />
                      <YAxis fontSize={12} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#F59E0B"
                        strokeWidth={2}
                        dot={{ fill: "#F59E0B", r: 4 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Monthly Offering Trend */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Monthly Offering Trend</CardTitle>
                </CardHeader>
                <CardContent className="h-64 sm:h-72 lg:h-80">
                  {monthlyOfferingData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyOfferingData}>
                        <XAxis dataKey="month" fontSize={12} />
                        <YAxis fontSize={12} />
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                        <Bar dataKey="amount" fill="#10b981" name="Offerings" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground text-sm">
                        {offeringsLoading ? "Loading..." : "No offering data available"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Offering Distribution */}
            <div className="grid gap-6 lg:grid-cols-2 mb-6">
              {/* Pie Chart */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Offering Distribution</CardTitle>
                </CardHeader>
                <CardContent className="h-64 sm:h-72 lg:h-80">
                  {pieChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieChartData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[entry.type as keyof typeof COLORS] || "#8884d8"} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value) => formatCurrency(value as number)} />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-muted-foreground text-sm">
                        {offeringsLoading ? "Loading..." : "No offering data available"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Type Breakdown */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Breakdown by Type</CardTitle>
                </CardHeader>
                <CardContent className="max-h-80 overflow-y-auto">
                  <div className="space-y-4">
                    {Object.entries(offeringStats.byType).map(([type, amount]) => {
                      const percentage = offeringStats.total > 0 
                        ? (amount / offeringStats.total) * 100 
                        : 0;
                      const Icon = getIconForType(type);
                      const color = getColorForType(type);
                      
                      return (
                        <div key={type} className="space-y-2">
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div className="flex items-center gap-2">
                              <div className={`p-1.5 rounded-lg bg-${color}-100`}>
                                <Icon className={`h-4 w-4 text-${color}-600`} />
                              </div>
                              <span className="font-medium capitalize text-sm sm:text-base">{type}</span>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="font-bold text-sm sm:text-base">{formatCurrency(amount)}</p>
                              <p className="text-xs text-muted-foreground">{percentage.toFixed(1)}%</p>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-500 bg-${color}-500`}
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      );
                    })}
                    
                    {Object.keys(offeringStats.byType).length === 0 && (
                      <div className="text-center py-8">
                        <p className="text-muted-foreground text-sm">
                          {offeringsLoading ? "Loading..." : "No offering data yet"}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activities */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Recent Gatherings */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Upcoming Gatherings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {gatherings.slice(0, 5).map((g) => (
                    <div
                      key={g._id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center border p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer gap-2"
                      onClick={() => router.push("/dashboard/gatherings")}
                    >
                      <div>
                        <p className="font-medium text-sm sm:text-base">{g.eventName}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(g.date).toLocaleDateString()} • {g.location}
                        </p>
                      </div>
                      <span className="text-xs font-semibold capitalize px-2 py-1 rounded-full bg-amber-100 text-amber-700 self-start sm:self-center">
                        {g.eventStatus?.replace("Event", "") || "Upcoming"}
                      </span>
                    </div>
                  ))}
                  
                  {gatherings.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground text-sm">No upcoming gatherings</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Offerings */}
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Recent Offerings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 max-h-96 overflow-y-auto">
                  {offerings.slice(0, 5).map((offering) => (
                    <div
                      key={offering._id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-center border p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer gap-2"
                      onClick={() => router.push("/dashboard/offerings")}
                    >
                      <div>
                        <p className="font-bold text-base sm:text-lg">
                          {formatCurrency(offering.amount)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(offering.date).toLocaleDateString()} • 
                          <span className="capitalize ml-1">{offering.type}</span>
                          {offering.memberName && ` • ${offering.memberName}`}
                        </p>
                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getTypeBadgeColor(offering.type)} self-start sm:self-center`}>
                        {offering.type}
                      </span>
                    </div>
                  ))}
                  
                  {offerings.length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground text-sm">
                        {offeringsLoading ? "Loading..." : "No offerings recorded yet"}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </WarpBackground>
      </div>
    </SidebarProvider>
  );
}

// Helper functions
function getIconForType(type: string) {
  const icons: Record<string, any> = {
    tithe: ChurchIcon,
    offering: Heart,
    seed: Leaf,
    pledge: Gift,
    thanksgiving: TrendingUp,
  };
  return icons[type] || DollarSign;
}

function getColorForType(type: string) {
  const colors: Record<string, string> = {
    tithe: "purple",
    offering: "pink",
    seed: "green",
    pledge: "orange",
    thanksgiving: "teal",
  };
  return colors[type] || "gray";
}

function getTypeBadgeColor(type: string) {
  const colors: Record<string, string> = {
    tithe: "bg-purple-100 text-purple-700",
    offering: "bg-pink-100 text-pink-700",
    seed: "bg-green-100 text-green-700",
    pledge: "bg-orange-100 text-orange-700",
    thanksgiving: "bg-teal-100 text-teal-700",
  };
  return colors[type] || "bg-gray-100 text-gray-700";
}

// StatCard Component
function StatCard({
  title,
  value,
  icon,
  subtitle,
  onClick,
}: {
  title: string;
  value: number | string;
  icon?: React.ReactNode;
  subtitle?: string;
  onClick?: () => void;
}) {
  return (
    <Card 
      onClick={onClick} 
      className="cursor-pointer hover:shadow-lg transition-all hover:scale-105 border-l-4 border-amber-500"
    >
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between mb-2">
          <CardTitle className="text-xs sm:text-sm text-muted-foreground">
            {title}
          </CardTitle>
          {icon}
        </div>
        <p className="text-lg sm:text-xl lg:text-2xl font-bold mt-2">{value}</p>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );
}