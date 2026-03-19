import { getDashboardStats } from "@/lib/dashboard-stat"
import DashboardClient from "./dashboard-client"

export default async function DashboardPage() {
  const stats = await getDashboardStats()
  
  // Ensure both properties exist
  const safeStats = {
    totalMembers: stats?.totalMembers ?? 0,
    newMembersThisMonth: stats?.newMembersThisMonth ?? 0
  }
  
  return <DashboardClient stats={safeStats} />
}