import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Member from "@/lib/models/member";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    await Member.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to delete member" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    const member = await Member.findById(id).lean();
    return NextResponse.json({ success: true, data: member });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch member" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await connectDB();
    const updatedMember = await Member.findByIdAndUpdate(id, body, { new: true }).lean();
    return NextResponse.json({ success: true, data: updatedMember });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to update member" },
      { status: 500 }
    );
  }
}