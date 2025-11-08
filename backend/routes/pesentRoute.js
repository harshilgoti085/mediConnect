const express = require("express");
const router = express.Router();
const Patient = require("../schema/pesentSchema");
const bcrypt = require("bcryptjs");
const { generateToken, jwtAuthMiddleware } = require("../jwt");

// ================= 1️⃣ Patient Signup =================
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      age,
      gender,
      contactNumber,
      address,
      medicalHistory,
      profileImage,
    } = req.body;

    // Check for existing patient
    const existing = await Patient.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already registered" });
    }

    // Create new patient
    const patient = new Patient({
      name,
      email,
      password,
      age,
      gender,
      contactNumber,
      address,
      medicalHistory,
      profileImage,
    });

    await patient.save();

    // Generate JWT token
    const token = generateToken(patient);

    res.status(201).json({
      message: "Patient registered successfully",
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        age: patient.age,
        gender: patient.gender,
        contactNumber: patient.contactNumber,
        address: patient.address,
        medicalHistory: patient.medicalHistory,
      },
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= 2️⃣ Patient Login =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const patient = await Patient.findOne({ email });
    if (!patient) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, patient.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    const token = generateToken(patient);

    res.status(200).json({
      message: "Login successful",
      token,
      patient: {
        id: patient._id,
        name: patient.name,
        email: patient.email,
        age: patient.age,
        gender: patient.gender,
        contactNumber: patient.contactNumber,
        address: patient.address,
        medicalHistory: patient.medicalHistory,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= 3️⃣ Get Patient Profile =================
router.get("/me", jwtAuthMiddleware, async (req, res) => {
  try {
    const patient = await Patient.findById(req.user.id).select("-password");
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    res.status(200).json(patient);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/all", async (req, res) => {
  try {
    const patients = await Patient.find().select("-password");
    res.status(200).json(patients);
  } catch (err) {
    console.error("Fetch patients error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= Get Single Patient by ID =================
router.get("/:id", async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).select("-password");
    if (!patient) return res.status(404).json({ error: "Patient not found" });
    res.status(200).json(patient);
  } catch (err) {
    console.error("Fetch single patient error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= Delete Patient =================
router.delete("/:id", async (req, res) => {
  try {
    const patient = await Patient.findByIdAndDelete(req.params.id);
    if (!patient) return res.status(404).json({ error: "Patient not found" });

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error("Delete patient error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
module.exports = router;
