import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Member from "@/lib/models/member"

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {

  try {

    await connectDB()

    const member = await Member.findById(params.id)

    if (!member) {
      return NextResponse.json(
        { error: "Member not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(member)

  } catch (error) {

    console.error("GET MEMBER ERROR:", error)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}


export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {

  try {

    await connectDB()

    const body = await req.json()

    const updatedMember = await Member.findByIdAndUpdate(
      params.id,
      body,
      { new: true }
    )

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
  { params }: { params: { id: string } }
) {

  try {

    await connectDB()

    await Member.findByIdAndDelete(params.id)

    return NextResponse.json({ message: "Member deleted" })

  } catch (error) {

    console.error("DELETE MEMBER ERROR:", error)

    return NextResponse.json(
      { error: "Server error" },
      { status: 500 }
    )
  }
}