import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/lib/models/event";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();

    const { eventName, date, location, organiser, eventStatus } = body;

    if (!eventName || !date || !location || !organiser || !eventStatus) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    const newEvent = await Event.create({
      eventName,
      date,
      location,
      organiser,
      eventStatus,
    });

    return NextResponse.json(newEvent, { status: 201 });
  } catch (error) {
    console.error("ADD Event ERROR:", error);

    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
