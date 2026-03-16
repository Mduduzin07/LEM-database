import connectDB from "@/lib/db"
import Member from "./models/member"

export async function getDashboardStats() {
  await connectDB()

  const totalMembers = await Member.countDocuments()

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  const newMembers = await Member.countDocuments({
    createdAt: { $gte: startOfMonth }
  })

  return {
    totalMembers,
    newMembers
  }
}