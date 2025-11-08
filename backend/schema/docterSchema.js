const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const doctorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  specialization: { type: String, required: true },
  experience: { type: Number, required: true },
  hospitalName: { type: String },
  contactNumber: { type: String },
  profileImage: { type: String },
  isApproved: { type: Boolean, default: false }, // 👈 NEW FIELD
  role: { type: String, default: "doctor" },
  workingHours: {
    start: { type: String, default: "09:00 AM" },
    end: { type: String, default: "06:00 PM" },
  },
  availableDays: {
    type: [String],
    default: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
  },
}, { timestamps: true });

doctorSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Doctor", doctorSchema);
