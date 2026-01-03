const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const patientSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  contactNumber: { type: String },
  address: { type: String },
  medicalHistory: { type: [String], default: [] },
  profileImage: { type: String },

  role: { type: String, default: "patient" },

  appointments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Appointment"
  }]

}, { timestamps: true });

patientSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("Patient", patientSchema);
