import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Member from "@/lib/models/member";


export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { firstName, lastName, email, phone, address, role, gender } = body;

    if (
      !firstName ||
      !lastName ||
      !phone ||
      !address ||
      !gender ||
      !role
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Check for existing member with phone only (email is optional)
    const existingMember = await Member.findOne({
      $or: [
        { phone },
        ...(email ? [{ email }] : []), // Only check email if it's provided
      ],
    });

    if (existingMember) {
      
      if (email && existingMember.email === email) {
        return NextResponse.json(
          { error: "Member with this email already exists" },
          { status: 400 },
        );
      }
      if (existingMember.phone === phone) {
        return NextResponse.json(
          { error: "Member with this phone number already exists" },
          { status: 400 },
        );
      }
    }

    const newMember = await Member.create({
      firstName,
      lastName,
      email: email || null,
      phone,
      address,
      role,
      gender
    });

    return NextResponse.json(newMember, { status: 201 });
  } catch (error) {
    console.error("ADD MEMBER ERROR:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
