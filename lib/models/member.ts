import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    email: {
      type:String,
      required:true,
      unique:true
    },
    phone: {
      type:String,
      required:true,
      unique:true
    },
   
    role: {
      type: String,
      enum: ["member", "pastor", "admin"],
      default: "member",
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Member ||
  mongoose.model("Member", memberSchema);