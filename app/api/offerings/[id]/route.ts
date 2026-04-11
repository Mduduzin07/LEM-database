import connectDB from "@/lib/db";
import Offering from "@/lib/models/offerings";
import { NextRequest, NextResponse } from "next/server";

// DELETE
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

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

// GET
export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const offering = await Offering.findById(id).lean();

    if (!offering) {
      return NextResponse.json(
        { success: false, error: "Offering not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { ...offering, _id: offering._id.toString() },
    });
  } catch (error) {
    console.error("Error fetching offering:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch offering" },
      { status: 500 }
    );
  }
}

// PUT
export async function PUT(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();

    const { id } = await context.params;

    const body = await req.json();

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
      data: { ...updatedOffering, _id: updatedOffering._id.toString() },
    });
  } catch (error) {
    console.error("Error updating offering:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update offering" },
      { status: 500 }
    );
  }
}