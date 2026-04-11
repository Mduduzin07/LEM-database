import connectDB from "@/lib/db";
import Offering from "@/lib/models/offerings";
import { NextResponse } from "next/server";

// DELETE offering by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    
    await connectDB();
    await Offering.findByIdAndDelete(id);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting offering:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete offering" },
      { status: 500 }
    );
  }
}

// GET single offering by ID (optional)
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    
    await connectDB();
    const offering = await Offering.findById(id).lean();
    
    if (!offering) {
      return NextResponse.json(
        { success: false, error: "Offering not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: { ...offering, _id: offering._id.toString() } 
    });
  } catch (error) {
    console.error("Error fetching offering:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch offering" },
      { status: 500 }
    );
  }
}

// PUT update offering by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; 
    const body = await request.json();
    
    await connectDB();
    
    const updatedOffering = await Offering.findByIdAndUpdate(
      id,
      body,
      { new: true, runValidators: true }
    ).lean();
    
    if (!updatedOffering) {
      return NextResponse.json(
        { success: false, error: "Offering not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ 
      success: true, 
      data: { ...updatedOffering, _id: updatedOffering._id.toString() } 
    });
  } catch (error) {
    console.error("Error updating offering:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update offering" },
      { status: 500 }
    );
  }
}