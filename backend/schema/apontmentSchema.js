const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: true,
    },
    date: {
      type: String, // "2025-01-20"
      required: true,
    },
    timeSlot: {
      type: String, // "10:00 AM - 10:30 AM"
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    reason: {
      type: String,
    },
    prescriptionImage: { type: String, default: "" },
  },
  { timestamps: true }
);

// ✅ IMPORTANT: MODEL NAME IS "Appointment"
module.exports =
  mongoose.models.Appointment ||
  mongoose.model("Appointment", appointmentSchema);
