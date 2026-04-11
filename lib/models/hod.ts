import mongoose from "mongoose";

const hodSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false, unique: false, sparse: true }, 
  phone: { type: String, required: true },
  department: { type: String, required: true },
  startDate: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  bio: { type: String, default: "" },
  responsibilities: [{ type: String }],
  assistants: [{
    name: String,
    role: String,
    phone: String,
  }],
}, { timestamps: true });

export default mongoose.models.HOD || mongoose.model("HOD", hodSchema);