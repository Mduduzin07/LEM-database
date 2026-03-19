import connectDB from "@/lib/db";
import Member from "@/lib/models/member";
import { MembersTable } from "./members-table";

async function getMembers() {
  await connectDB();

  const members = await Member.find().lean();

  return JSON.parse(JSON.stringify(members));
}

export default async function MembersPage() {
  const members = await getMembers();

  return (
    <div className="py-3 h-[calc(100vh-64px)]">
      <MembersTable data={members} />
    </div>
  );
}
