import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Gathering from "@/lib/models/gathering";

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params; 

    const body = await req.json();

    const updated = await Gathering.findByIdAndUpdate(
      id,
      {
        ...body,
        date: new Date(body.date),
      },
      { new: true }
    );

    return NextResponse.json(updated);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: "Failed to update gathering" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  await Gathering.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}