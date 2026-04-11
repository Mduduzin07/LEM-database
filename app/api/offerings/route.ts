import connectDB from "@/lib/db";
import Offering from "@/lib/models/offerings";
import { NextResponse } from "next/server";

// GET all offerings
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    let query = {};
    
    if (type && type !== 'all') {
      query = { type };
    }
    
    if (startDate && endDate) {
      query = {
        ...query,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      };
    }
    
    const offerings = await Offering.find(query).sort({ date: -1 }).lean();
    
    const serializedOfferings = offerings.map(offering => ({
      ...offering,
      _id: offering._id.toString()
    }));
    
    return NextResponse.json({ success: true, data: serializedOfferings });
  } catch (error) {
    console.error("Error fetching offerings:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch offerings" },
      { status: 500 }
    );
  }
}

// POST create offering
export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    if (!body.amount) {
      return NextResponse.json(
        { success: false, error: "Amount is required" },
        { status: 400 }
      );
    }
    
    const offering = await Offering.create({
      amount: body.amount,
      type: body.type || "offering",
      date: body.date,
      memberName: body.memberName || "",
      note: body.note || "",
    });
    
    return NextResponse.json({ 
      success: true, 
      data: { ...offering.toObject(), _id: offering._id.toString() } 
    }, { status: 201 });
  } catch (error) {
    console.error("Error creating offering:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create offering" },
      { status: 500 }
    );
  }
}

// PUT update offering (alternative without [id] route)
export async function PUT(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    const { id, ...updateData } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }
    
    const updatedOffering = await Offering.findByIdAndUpdate(
      id,
      updateData,
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

// DELETE offering (alternative without [id] route)
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: "ID is required" },
        { status: 400 }
      );
    }
    
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