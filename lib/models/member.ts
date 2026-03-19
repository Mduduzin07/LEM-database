import mongoose from "mongoose";

const memberSchema = new mongoose.Schema(
  {
    firstName: String,
    lastName: String,
    gender:String,
    email: {
    type: String,
    required: false, 
    sparse: true,    // ←- sparse allows multiple null values
    trim: true,
    lowercase: true,
    },
    phone: {
      type:String,
      required:true,
      unique:true
    },
    address:String,
   
    role: {
      type: String,
      enum: ["member", "pastor", "admin","leader"],
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