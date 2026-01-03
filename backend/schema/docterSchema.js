const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const doctorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    specialization: { type: String, required: true },
    experience: { type: Number, required: true },
    hospitalName: String,
    contactNumber: String,
    profileImage: String,
    
    // ✅ ADDED NEW FIELDS
    hourlyRate: { type: Number, required: true, default: 0 }, // The consultation fee
    availableDays: { 
      type: [String], 
      default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] 
    },
    slotDuration: { type: Number, default: 30 }, // Duration in minutes

    isApproved: { type: Boolean, default: false },
    role: { type: String, default: "doctor" },
  },
  { timestamps: true }
);

// ✅ HASH PASSWORD ONLY ON CREATE / CHANGE
doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Doctor", doctorSchema);