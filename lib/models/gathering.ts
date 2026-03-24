import mongoose from "mongoose";

const gatheringSchema = new mongoose.Schema(
  {
    eventName: String,
    date: String,
    location: String,
    organiser: {
      type:String,
      enum: [
        "Pastoral",
        "Youth",
        "Men's ministry",
        "Women's ministry",
        "Media team",
        "Worship team",
        "Sunday school",
      ],
      default:"Pastoral"
    },
    eventStatus: {
      type:String,
      enum: [
        "scheduled",
        "cancelled",
        "postponed",
        "rescheduled",
      ],
      default: "scheduled",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Gathering || mongoose.model("Gathering", gatheringSchema);
