const express = require("express");
const router = express.Router();
const Doctor = require("../schema/docterSchema");
const bcrypt = require("bcryptjs");
const { generateToken, jwtAuthMiddleware } = require("../jwt");

// ================= Doctor Signup =================
router.post("/register", async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      specialization,
      experience,
      hospitalName,
      contactNumber,
      profileImage,
    } = req.body;

    const existing = await Doctor.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const doctor = new Doctor({
      name,
      email,
      password,
      specialization,
      experience,
      hospitalName,
      contactNumber,
      profileImage,
      isApproved: false, // 👈 default false
    });

    await doctor.save();

    res.status(201).json({
      message: "Registration successful. Awaiting admin approval.",
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        hospitalName: doctor.hospitalName,
        contactNumber: doctor.contactNumber,
        isApproved: doctor.isApproved,
      },
    });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= Doctor Login =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email });

    if (!doctor) return res.status(400).json({ error: "Invalid email or password" });

    // Check approval status 👇
    if (!doctor.isApproved) {
      return res.status(403).json({ error: "Your account is pending admin approval." });
    }

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = generateToken(doctor);

    res.status(200).json({
      message: "Login successful",
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        specialization: doctor.specialization,
        experience: doctor.experience,
        hospitalName: doctor.hospitalName,
        contactNumber: doctor.contactNumber,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});
router.get("/all", async (req, res) => {
  try {
    const doctors = await Doctor.find().select("-password");
    res.status(200).json(doctors);
  } catch (err) {
    console.error("Fetch doctors error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= Get Single Doctor by ID =================
router.get("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id).select("-password");
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.status(200).json(doctor);
  } catch (err) {
    console.error("Fetch single doctor error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= Delete Doctor =================
router.delete("/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findByIdAndDelete(req.params.id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    res.status(200).json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error("Delete doctor error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= Approve Doctor =================
router.put("/approve/:id", async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });

    doctor.isApproved = true;
    await doctor.save();

    res.status(200).json({ message: "Doctor approved successfully" });
  } catch (err) {
    console.error("Approval error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= Get Doctor Profile =================
router.get("/me", jwtAuthMiddleware, async (req, res) => {
  try {
    const doctor = await Doctor.findById(req.user.id).select("-password");
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.status(200).json(doctor);
  } catch (err) {
    console.error("Profile fetch error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
