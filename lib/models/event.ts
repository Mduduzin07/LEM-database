import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    eventName: String,
    date: String,
    location: String,
    organiser: {
      enum: [
        "Pastoral",
        "Youth",
        "Men's ministry",
        "Women's ministry",
        "Media team",
        "Worship team",
        "Sunday school",
      ],
    },
    eventStatus: {
      enum: [
        "EventScheduled",
        "EventCancelled",
        "EventPostponed",
        "EventRescheduled",
      ],
      default: "EventScheduled",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Event || mongoose.model("Event", eventSchema);
