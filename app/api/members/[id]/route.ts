import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Member from "@/lib/models/member"

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params  

  try {

    await connectDB()

    const body = await req.json()

    const updatedMember = await Member.findByIdAndUpdate(
      id,
      body,
      {
        returnDocument: "after", 
        runValidators: true
      }
    )

    if (!updatedMember) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedMember)

  } catch (error) {

    console.error("UPDATE MEMBER ERROR:", error)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}


export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params

  await connectDB()

  await Member.findByIdAndDelete(id)

  return NextResponse.json({ message: "Member deleted" })
}
