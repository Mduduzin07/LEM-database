import mongoose from "mongoose";

const offeringSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      required: true,
    },

    type: {
      type: String,
      enum: ["tithe", "offering", "seed", "thanksgiving","pledge"],
      default: "offering",
    },

    date: {
      type: String,
      required: true,
    },

    memberName: {
      type: String,
      default: "",
    },

    note: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

export default mongoose.models.Offering ||
  mongoose.model("Offering", offeringSchema);
