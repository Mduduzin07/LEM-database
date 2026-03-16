import Member from "@/lib/models/member";
import connectDB from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  await connectDB();

  const body = await req.json();

  const member = await Member.create(body);

  return NextResponse.json(member);
}

// Get members
export async function GET() {
  await connectDB();

  const members = await Member.find().sort({ createdAt: -1 });

  return NextResponse.json(members);
}