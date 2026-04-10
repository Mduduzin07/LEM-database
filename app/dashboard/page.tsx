import connectDB from "@/lib/db";
import Gathering from "@/lib/models/gathering";
import Member from "@/lib/models/member";
import DashboardClient from "./dashboard-client";

//  ISR (auto refresh every 30s)
export const revalidate = 30;

//  Serialize gatherings (VERY IMPORTANT)
async function getGatherings() {
  const gatherings = await Gathering.find()
    .sort({ date: -1 })
    .lean();

  return gatherings.map((g) => ({
    _id: g._id.toString(),
    eventName: g.eventName,
    date: g.date ? new Date(g.date).toISOString() : null,
    location: g.location,
    organiser: g.organiser,
    eventStatus: g.eventStatus,
  }));
}

//  Member stats
async function getMemberStats() {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  const [totalMembers, newMembersThisMonth] = await Promise.all([
    Member.countDocuments(),
    Member.countDocuments({
      createdAt: {
        $gte: startOfMonth,
        $lte: endOfMonth,
      },
    }),
  ]);

  return {
    totalMembers,
    newMembersThisMonth,
  };
}

// Serialize members for chart
async function getMembersForChart() {
  const members = await Member.find()
    .select("createdAt")
    .lean();

  return members.map((m) => ({
    createdAt: m.createdAt?.toISOString(),
  }));
}

//  Gathering stats
function getGatheringStats(gatherings: any[]) {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const totalGatherings = gatherings.length;

  const gatheringsThisMonth = gatherings.filter((g) => {
    if (!g.date) return false;

    const eventDate = new Date(g.date);

    return (
      eventDate.getMonth() === currentMonth &&
      eventDate.getFullYear() === currentYear
    );
  }).length;

  return {
    totalGatherings,
    gatheringsThisMonth,
  };
}

// Member growth
function getMemberGrowthData(members: any[]) {
  const months: Record<string, number> = {};

  members.forEach((m) => {
    if (!m.createdAt) return;

    const date = new Date(m.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth() + 1}`;

    months[key] = (months[key] || 0) + 1;
  });

  return Object.entries(months).map(([month, count]) => ({
    month,
    count,
  }));
}

// MAIN PAGE
export default async function DashboardPage() {
  await connectDB();

  // Clean parallel fetching (NO inline awaits)
  const [memberStats, gatherings, members] = await Promise.all([
    getMemberStats(),
    getGatherings(),
    getMembersForChart(),
  ]);

  const gatheringStats = getGatheringStats(gatherings);
  const memberGrowth = getMemberGrowthData(members);

  return (
    <DashboardClient
      stats={memberStats}
      gatherings={gatherings}
      gatheringStats={gatheringStats}
      memberGrowth={memberGrowth}
    />
  );
}