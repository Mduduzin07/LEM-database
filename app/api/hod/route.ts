import connectDB from "@/lib/db";
import HOD from "@/lib/models/hod";
import { NextResponse } from "next/server";

// GET all HODs
export async function GET(request: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(request.url);
    const department = searchParams.get('department');
    const isActive = searchParams.get('isActive');
    
    let query = {};
    
    if (department && department !== 'all') {
      query = { department };
    }
    
    if (isActive !== null) {
      query = { ...query, isActive: isActive === 'true' };
    }
    
    const hods = await HOD.find(query).sort({ department: 1, name: 1 }).lean();
    
    const serializedHODs = hods.map(hod => ({
      ...hod,
      _id: hod._id.toString(),
    }));
    
    return NextResponse.json({ success: true, data: serializedHODs });
  } catch (error) {
    console.error("Error fetching HODs:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch HODs" },
      { status: 500 }
    );
  }
}

// POST create HOD
export async function POST(request: Request) {
  try {
    await connectDB();
    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.email || !body.phone || !body.department || !body.startDate) {
      return NextResponse.json(
        { success: false, error: "Required fields are missing" },
        { status: 400 }
      );
    }
    
    const existingHOD = await HOD.findOne({ email: body.email });
    if (existingHOD) {
      return NextResponse.json(
        { success: false, error: "HOD with this email already exists" },
        { status: 400 }
      );
    }
    
    const hod = await HOD.create(body);
    
    return NextResponse.json(
      { success: true, data: { ...hod.toObject(), _id: hod._id.toString() } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating HOD:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create HOD" },
      { status: 500 }
    );
  }
}