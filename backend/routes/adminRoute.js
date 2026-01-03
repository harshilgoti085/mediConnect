const express = require("express");
const router = express.Router();
const Admin = require("../schema/adminSchema");
const Doctor = require("../schema/docterSchema");
const bcrypt = require("bcryptjs");
const { generateToken, jwtAuthMiddleware } = require("../jwt");

// ============== Admin Register =================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Admin.findOne({ email });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const admin = new Admin({ name, email, password });
    await admin.save();

    res.status(201).json({ message: "Admin registered" });
  } catch (err) {
    console.error("Admin register error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============== Admin Login =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = generateToken(admin);
    res.status(200).json({ message: "Login successful", token });
  } catch (err) {
    console.error("Admin login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// ============== Approve Doctor =================
// router.put("/approve/:doctorId", jwtAuthMiddleware, async (req, res) => {
//   try {
//     const doctor = await Doctor.findById(req.params.doctorId);
//     if (!doctor) return res.status(404).json({ error: "Doctor not found" });

//     doctor.isApproved = true;
//     await doctor.save();

//     res.status(200).json({ message: "Doctor approved successfully" });
//   } catch (err) {
//     console.error("Doctor approval error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// // ============== Get All Pending Doctors =================
// router.get("/pending-doctors", jwtAuthMiddleware, async (req, res) => {
//   try {
//     const pending = await Doctor.find({ isApproved: false }).select("-password");
//     res.status(200).json(pending);
//   } catch (err) {
//     console.error("Pending doctors fetch error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

module.exports = router;
