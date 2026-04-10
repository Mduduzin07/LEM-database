
import mongoose from "mongoose";

const gatheringSchema = new mongoose.Schema(
  {
    eventName: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    organiser: {
      type: String,
      required: true,
      enum: [
        "Pastoral",
        "Youth",
        "Men's ministry",
        "Women's ministry",
        "Media team",
        "Worship team",
        "Sunday school",
      ],
      default: "Pastoral",
    },
    eventStatus: {
      type: String,
      required: true,
      enum: ["scheduled", "cancelled", "postponed", "rescheduled"],
      default: "scheduled",
    },
  },
  { 
    timestamps: true,
    // Add a virtual field for the combined datetime
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

// Virtual field that combines date and time
gatheringSchema.virtual('dateTime').get(function() {
  if (this.date && this.time) {
    return new Date(`${this.date}T${this.time}:00`);
  }
  return null;
});

// Method to check if event is upcoming
gatheringSchema.methods.isUpcoming = function() {
  const eventDateTime = new Date(`${this.date}T${this.time}:00`);
  return eventDateTime > new Date();
};

export default mongoose.models.Gathering ||
  mongoose.model("Gathering", gatheringSchema);