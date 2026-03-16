import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Member from "@/lib/models/member";
import { toast } from "react-toastify";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { firstName, lastName, email, phone, address, role } = body;

    if (!firstName || !lastName || !email || !phone || !address || !role) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const existingMember = await Member.findOne({
      $or: [{ email }, { phone }],
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "Member with this email or phone already exists" },
        { status: 400 },
      );
    }

    const newMember = await Member.create({
      firstName,
      lastName,
      email,
      phone,
      address,
      role,
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("ADD MEMBER ERROR:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
