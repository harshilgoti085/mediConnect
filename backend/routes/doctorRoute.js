/*const express = require("express");
const router = express.Router();
const Doctor = require("../schema/docterSchema");
const bcrypt = require("bcryptjs");
const { generateToken, jwtAuthMiddleware } = require("../jwt");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const emailLower = req.body.email.toLowerCase().trim();
    const existing = await Doctor.findOne({ email: emailLower });

    if (existing) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const doctor = new Doctor({
      ...req.body,
      email: emailLower,
      role: "doctor" // Explicitly set role in DB
    });

    await doctor.save();
    res.status(201).json({ message: "Registration successful." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email: email.toLowerCase().trim() });

    if (!doctor) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    // IMPORTANT: Ensure your doctor object has the role "doctor" 
    // so generateToken(doctor) creates a DOCTOR token.
    const token = generateToken(doctor);

    res.json({
      message: "Login successful",
      token,
      doctor: {
        id: doctor._id,
        name: doctor.name,
        email: doctor.email,
        role: "doctor"
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});


// ================= GET ALL DOCTORS =================
router.get("/all", async (req, res) => {
  try {
    const doctors = await Doctor.find({}, "-password");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});



// ================= GET LOGGED-IN DOCTOR PROFILE =================
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    // req.user.id comes from the decoded token in your jwtAuthMiddleware
    const doctor = await Doctor.findById(req.user.id).select("-password");

    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    res.json(doctor);
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ error: "Server error fetching profile" });
  }
});

// ================= UPDATE DOCTOR PROFILE =================
router.put("/update-profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const updatedData = req.body;
    
    // Prevent password from being updated via this route for security
    delete updatedData.password; 

    const doctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select("-password");

    res.json({ message: "Profile updated successfully", doctor });
  } catch (err) {
    console.error("Update Error:", err);
    res.status(500).json({ error: "Failed to update profile" });
  }
});

// ... rest of your routes (me, all)
module.exports = router;*/
const express = require("express");
const router = express.Router();
const Doctor = require("../schema/docterSchema");
const bcrypt = require("bcryptjs");
const { generateToken, jwtAuthMiddleware } = require("../jwt");

// ================= REGISTER =================
router.post("/register", async (req, res) => {
  try {
    const emailLower = req.body.email.toLowerCase().trim();
    const existing = await Doctor.findOne({ email: emailLower });
    if (existing) return res.status(400).json({ error: "Email already exists" });

    const doctor = new Doctor({
      ...req.body,
      email: emailLower,
      role: "doctor"
    });

    await doctor.save();
    res.status(201).json({ message: "Registration successful." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= LOGIN =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const doctor = await Doctor.findOne({ email: email.toLowerCase().trim() });
    if (!doctor) return res.status(400).json({ error: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, doctor.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid email or password" });

    const token = generateToken(doctor);
    res.json({
      message: "Login successful",
      token,
      doctor: { id: doctor._id, name: doctor.name, role: "doctor" },
    });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ================= GET PROFILE (CRITICAL FIX) =================
// This is the route that was giving the 404 error
router.get("/profile", jwtAuthMiddleware, async (req, res) => {
  try {
    // req.user.id is extracted from the JWT token by the middleware
    const doctor = await Doctor.findById(req.user.id).select("-password");
    if (!doctor) return res.status(404).json({ error: "Doctor not found" });
    res.json(doctor);
  } catch (err) {
    console.error("Profile Fetch Error:", err);
    res.status(500).json({ error: "Server error fetching profile" });
  }
});

// ================= UPDATE PROFILE =================
router.put("/update-profile", jwtAuthMiddleware, async (req, res) => {
  try {
    const updatedData = req.body;
    delete updatedData.password; 
    const doctor = await Doctor.findByIdAndUpdate(
      req.user.id,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select("-password");
    res.json({ message: "Profile updated successfully", doctor });
  } catch (err) {
    res.status(500).json({ error: "Failed to update profile" });
  }
});


// ================= GET ALL DOCTORS =================
router.get("/all", async (req, res) => {
  try {
    const doctors = await Doctor.find({}, "-password");
    res.json(doctors);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

