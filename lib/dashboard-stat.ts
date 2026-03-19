import connectDB from "@/lib/db"
import Member from "@/lib/models/member"

export async function getDashboardStats() {
  await connectDB()
  
  const now = new Date()
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const firstDayOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
  
  const [totalMembers, newMembersThisMonth] = await Promise.all([
    Member.countDocuments(),
    Member.countDocuments({
      createdAt: {
        $gte: firstDayOfMonth,
        $lt: firstDayOfNextMonth
      }
    })
  ])
  
  return {
    totalMembers,
    newMembersThisMonth
  }
}