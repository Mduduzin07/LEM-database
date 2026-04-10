
import connectDB from "@/lib/db";
import Gathering from "@/lib/models/gathering";
import GatheringsTable from "./gatherings-table";
import AddGatheringButton from "./add-gathering/add-gathering-button";
import NextEvent from "./next-gathering";
import DashboardStats from "../dashboard-stat";

async function getGatherings() {
  await connectDB();

  const gatherings = await Gathering.find()
    .sort({ date: -1, time: -1 })
    .lean();

  return gatherings.map((g) => {
    // Validate and create datetime safely
    let validDateTime = null;
    let dateTimeString = null;
    
    if (g.date && g.time) {
      try {
        const dateTime = new Date(`${g.date}T${g.time}:00`);
        // Check if the date is valid
        if (!isNaN(dateTime.getTime())) {
          validDateTime = dateTime;
          dateTimeString = dateTime.toISOString();
        }
      } catch (error) {
        console.error(`Invalid date/time for gathering ${g._id}:`, { date: g.date, time: g.time });
      }
    }

    return {
      _id: g._id.toString(),
      eventName: g.eventName || "Untitled Event",
      date: g.date || "",
      time: g.time || "",
      dateTime: dateTimeString || new Date().toISOString(), // Fallback to current date
      location: g.location || "",
      organiser: g.organiser || "Pastoral",
      eventStatus: g.eventStatus || "scheduled",
    };
  });
}

export default async function GatheringsPage() {
  const gatherings = await getGatherings();

  return (
    <div className="h-full space-y-3 flex flex-col p-5 pt-0 overflow-y-auto">
      {/* HEADER */}
      <div className="flex items-center justify-center sticky top-0 p-2 bg-[#FAFAFA] w-screen">
        <h1 className="text-2xl font-bold mr-5">Church Gatherings</h1>
        <span className="text-xs">
          <AddGatheringButton />
        </span>
      </div>

      {/* NEXT EVENT */}
      <NextEvent data={gatherings} />

      {/* STATS */}
      <DashboardStats data={gatherings} />

      {/* TABLE */}
      <GatheringsTable data={gatherings} />
    </div>
  );
}