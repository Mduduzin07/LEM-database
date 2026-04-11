import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Hod from "@/lib/models/hod"; 

export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const body = await req.json();

    const updated = await Hod.findByIdAndUpdate(
      id,
      body,
      { new: true }
    );

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, error: "Update failed" },
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

  await Hod.findByIdAndDelete(id);

  return NextResponse.json({ success: true });
}