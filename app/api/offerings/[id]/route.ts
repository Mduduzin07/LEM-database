import connectDB from "@/lib/db";
import Offering from "@/lib/models/offerings";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
  try {
    await connectDB();
    
    const body = await request.json();
    
    const offering = await Offering.create({
      amount: body.amount,
      type: body.type,
      date: body.date,
      memberName: body.memberName,
      note: body.note,
    });
    
    return NextResponse.json({ success: true, data: offering }, { status: 201 });
  } catch (error) {
    console.error("Error creating offering:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create offering" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  await Offering.findByIdAndDelete(params.id);
  return NextResponse.json({ success: true });
}


export async function GET() {
  await connectDB();
  const offerings = await Offering.find().sort({ date: -1 }).lean();
  return NextResponse.json({ success: true, data: offerings });
}

