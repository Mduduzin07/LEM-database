
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/lib/models/gathering";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { eventName, date, time, location, organiser, eventStatus } = body;

    if (
      !eventName ||
      !date ||
      !time ||
      !location ||
      !organiser ||
      !eventStatus
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 },
      );
    }

    // Validate that the date and time create a valid datetime
    const dateTimeString = `${date}T${time}:00`;
    const eventDateTime = new Date(dateTimeString);
    
    if (isNaN(eventDateTime.getTime())) {
      return NextResponse.json(
        { error: "Invalid date or time format" },
        { status: 400 },
      );
    }

    // Store date and time as strings (preserving user input)
    const newEvent = await Event.create({
      eventName,
      date, 
      time, 
      location,
      organiser,
      eventStatus,
    });

    // Return the event with combined datetime for client use
    return NextResponse.json(
      { 
        ...newEvent.toObject(),
        dateTime: eventDateTime.toISOString()
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("ADD Event ERROR:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}