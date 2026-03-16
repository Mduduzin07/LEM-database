import DashboardClient from "./dashboard-client"
import { getDashboardStats } from "@/lib/dashboard-stat"

export default async function Dashboard() {

  const stats = await getDashboardStats()

  return (
  <DashboardClient stats={stats} />
  )
}