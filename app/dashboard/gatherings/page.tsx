import connectDB from "@/lib/db";
import Gathering from "@/lib/models/gathering";
import GatheringsTable from "./gatherings-table";
import { PlusIcon } from "lucide-react";
import AddGatheringButton from "./add-gathering/add-gathering-button";

async function getGatherings() {
  await connectDB();
  return await Gathering.find().lean();
}

export default async function Gatherings() {
  const gatherings = await getGatherings();

  return (
    <div className="p-4 md:p-6 space-y-6">
      <div className="flex items-center">
        <h1 className="text-2xl font-bold">Church Gatherings</h1>
        <AddGatheringButton/>
      </div>
      <div>
        <GatheringsTable data={gatherings} />
      </div>
    </div>
  );
}
