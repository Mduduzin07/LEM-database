import connectDB from "@/lib/db"
import Member from "@/lib/models/member"
import { MembersTable } from "./members-table"
import AddMemberButton from "./add-member-btn"

async function getMembers() {
  await connectDB()

  const members = await Member.find().lean()

  return JSON.parse(JSON.stringify(members))
}

export default async function MembersPage() {
  const members = await getMembers()

  return (
    <div className="p-6 space-y-6">

      <h1 className="text-3xl font-bold">
        Members
      </h1>
      <AddMemberButton/>

      <MembersTable data={members} />

    </div>
  )
}