import connectDB from "@/lib/db";
import HOD from "@/lib/models/hod";
import { NextResponse } from "next/server";

// GET single HOD
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    
    const hod = await HOD.findById(id).lean();
    
    if (!hod) {
      return NextResponse.json(
        { success: false, error: "HOD not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: { ...hod, _id: hod._id.toString() },
    });
  } catch (error) {
    console.error("Error fetching HOD:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch HOD" },
      { status: 500 }
    );
  }
}

// PUT update HOD
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    await connectDB();
    
    const updatedHOD = await HOD.findByIdAndUpdate(
      id,
      { ...body, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).lean();
    
    if (!updatedHOD) {
      return NextResponse.json(
        { success: false, error: "HOD not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({
      success: true,
      data: { ...updatedHOD, _id: updatedHOD._id.toString() },
    });
  } catch (error) {
    console.error("Error updating HOD:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update HOD" },
      { status: 500 }
    );
  }
}

// DELETE HOD
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await connectDB();
    await HOD.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting HOD:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete HOD" },
      { status: 500 }
    );
  }
}