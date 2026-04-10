import { NextResponse } from "next/server"
import connectDB from "@/lib/db"
import Gathering from "@/lib/models/gathering"

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {

  const { id } = await context.params  

  try {

    await connectDB()

    const body = await req.json()

    const updatedGathering = await Gathering.findByIdAndUpdate(
      id,
      body,
      {
        returnDocument: "after", 
        runValidators: true
      }
    )

    if (!updatedGathering) {
      return NextResponse.json(
        { error: "Event not found" },
        { status: 404 }
      )
    }

    return NextResponse.json(updatedGathering)

  } catch (error) {

    console.error("UPDATE Event ERROR:", error)

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

  await Gathering.findByIdAndDelete(id)

  return NextResponse.json({ message: "Event deleted" })
}
