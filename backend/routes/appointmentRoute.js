// const express = require("express");
// const router = express.Router();
// const Appointment = require("../schema/apontmentSchema");
// const Doctor = require("../schema/docterSchema");
// const Patient = require("../schema/pesentSchema");
// const { jwtAuthMiddleware } = require("../jwt");
// const multer = require("multer");
// const path = require("path");

// /* =====================================================
//    1️⃣ PATIENT → REQUEST APPOINTMENT
// ===================================================== */
// router.post("/request", jwtAuthMiddleware, async (req, res) => {
//   try {
//     const { doctorId, date, timeSlot, reason } = req.body;
    
//     // Based on your JWT file: req.user contains the decoded payload { id, role }
//     const patientId = req.user.id; 

//     if (!doctorId) {
//       return res.status(400).json({ error: "Doctor ID is required" });
//     }

//     const appointment = new Appointment({
//       patientId,
//       doctorId,
//       date,
//       timeSlot,
//       reason,
//       status: "pending",
//     });

//     await appointment.save();

//     // Push appointment to patient schema
//     await Patient.findByIdAndUpdate(patientId, {
//       $push: { appointments: appointment._id },
//     });

//     res.status(201).json({ message: "Appointment request sent!", appointment });
//   } catch (error) {
//     console.error("Booking Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });
// /* =====================================================
//    2️⃣ DOCTOR → VIEW ALL MY APPOINTMENTS
// ===================================================== */


// /* =====================================================
//    3️⃣ DOCTOR → APPROVE APPOINTMENT
// ===================================================== */
// router.post("/approve", jwtAuthMiddleware, async (req, res) => {
//   try {
//     const { appointmentId } = req.body;
//     const appointment = await Appointment.findById(appointmentId);

//     if (!appointment) return res.status(404).json({ message: "Appointment not found" });

//     const conflict = await Appointment.findOne({
//       doctorId: appointment.doctorId,
//       date: appointment.date,
//       timeSlot: appointment.timeSlot,
//       status: "approved",
//     });

//     if (conflict) return res.status(400).json({ message: "Slot already booked" });

//     appointment.status = "approved";
//     await appointment.save();
//     res.json({ message: "Appointment approved successfully" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// /* =====================================================
//    4️⃣ DOCTOR → REJECT APPOINTMENT
// ===================================================== */
// router.post("/reject", jwtAuthMiddleware, async (req, res) => {
//   try {
//     const { appointmentId } = req.body;
//     await Appointment.findByIdAndUpdate(appointmentId, { status: "rejected" });
//     res.json({ message: "Appointment rejected" });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// /* =====================================================
//    5️⃣ PATIENT → VIEW MY APPOINTMENTS
// ===================================================== */
// router.get("/by-patient/:patientId", async (req, res) => {
//   try {
//     const appointments = await Appointment.find({
//       patientId: req.params.patientId,
//     })
//       .populate("doctorId", "name specialization hospitalName")
//       .sort({ createdAt: -1 });

//     res.json(appointments);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });





// // GET appointments for the logged-in doctor
// router.get("/by-doctor/:doctorId", async (req, res) => {
//   try {
//     const appointments = await Appointment.find({
//       doctorId: req.params.doctorId,
//     })
//       .populate("patientId", "name email phone") // Populates patient details
//       .sort({ createdAt: -1 });

//     res.json(appointments);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });


// /* =====================================================
//    6️⃣ GET BOOKED SLOTS (PATIENT VIEW)
// ===================================================== */
// router.get("/booked-slots/:doctorId/:date", async (req, res) => {
//   try {
//     const { doctorId, date } = req.params;

//     const bookedSlots = await Appointment.find({
//       doctorId,
//       date,
//       status: "approved",
//     }).select("timeSlot");

//     res.json(bookedSlots);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });




// router.get("/my-appointments", jwtAuthMiddleware, async (req, res) => {
//   try {
//     console.log("Logged in User ID from Token:", req.user.id); // Check this in your VS Code terminal

//     const appointments = await Appointment.find({ doctorId: req.user.id })
//       .populate("patientId", "name email contactNumber")
//       .sort({ createdAt: -1 });

//     console.log("Number of appointments found:", appointments.length);
//     res.json(appointments);
//   } catch (error) {
//     console.error("Backend Error:", error);
//     res.status(500).json({ error: error.message });
//   }
// });




// module.exports = router;
const express = require("express");
const router = express.Router();
const Appointment = require("../schema/apontmentSchema");
const Doctor = require("../schema/docterSchema");
const Patient = require("../schema/pesentSchema");
const { jwtAuthMiddleware } = require("../jwt");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

/* =====================================================
   MULTER CONFIG (FOR PRESCRIPTION UPLOAD)
===================================================== */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const dir = "uploads/prescriptions";
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    cb(null, dir);
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

/* =====================================================
   1️⃣ PATIENT → REQUEST APPOINTMENT
===================================================== */
router.post("/request", jwtAuthMiddleware, async (req, res) => {
  try {
    const { doctorId, date, timeSlot, reason } = req.body;
    const patientId = req.user.id;

    if (!doctorId) {
      return res.status(400).json({ error: "Doctor ID is required" });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      timeSlot,
      reason,
      status: "pending",
    });

    await appointment.save();

    await Patient.findByIdAndUpdate(patientId, {
      $push: { appointments: appointment._id },
    });

    res.status(201).json({
      message: "Appointment request sent!",
      appointment,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});





// Route to mark an appointment as "done"
// ✅ Add jwtAuthMiddleware here to match your frontend request
router.put("/mark-done/:id", jwtAuthMiddleware, async (req, res) => {
  try {
    const { id } = req.params;

    const updatedAppointment = await Appointment.findByIdAndUpdate(
      id,
      { status: "done" },
      { new: true }
    );

    if (!updatedAppointment) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    res.status(200).json({ 
      message: "Appointment marked as done successfully", 
      data: updatedAppointment 
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});














/* =====================================================
   2️⃣ DOCTOR → VIEW MY APPOINTMENTS (TOKEN BASED)
===================================================== */
router.get("/my-appointments", jwtAuthMiddleware, async (req, res) => {
  try {
    const appointments = await Appointment.find({
      doctorId: req.user.id,
    })
      .populate("patientId", "name email contactNumber")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =====================================================
   3️⃣ DOCTOR → APPROVE APPOINTMENT
===================================================== */
router.post("/approve", jwtAuthMiddleware, async (req, res) => {
  try {
    const { appointmentId } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment)
      return res.status(404).json({ message: "Appointment not found" });

    const conflict = await Appointment.findOne({
      doctorId: appointment.doctorId,
      date: appointment.date,
      timeSlot: appointment.timeSlot,
      status: "approved",
    });

    if (conflict)
      return res.status(400).json({ message: "Slot already booked" });

    appointment.status = "approved";
    await appointment.save();

    res.json({ message: "Appointment approved" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =====================================================
   4️⃣ DOCTOR → REJECT APPOINTMENT
===================================================== */
router.post("/reject", jwtAuthMiddleware, async (req, res) => {
  try {
    const { appointmentId } = req.body;
    await Appointment.findByIdAndUpdate(appointmentId, {
      status: "rejected",
    });

    res.json({ message: "Appointment rejected" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =====================================================
   5️⃣ PATIENT → VIEW MY APPOINTMENTS
===================================================== */
router.get("/by-patient/:patientId", async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.params.patientId,
    })
      .populate("doctorId", "name specialization hospitalName")
      .sort({ createdAt: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =====================================================
   6️⃣ GET BOOKED SLOTS (PATIENT)
===================================================== */
router.get("/booked-slots/:doctorId/:date", async (req, res) => {
  try {
    const { doctorId, date } = req.params;

    const bookedSlots = await Appointment.find({
      doctorId,
      date,
      status: "approved",
    }).select("timeSlot");

    res.json(bookedSlots);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/* =====================================================
   7️⃣ DOCTOR → UPLOAD PRESCRIPTION
===================================================== */
router.post(
  "/upload-prescription/:appointmentId",
  jwtAuthMiddleware,
  upload.single("prescription"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const appointment = await Appointment.findById(
        req.params.appointmentId
      );

      if (!appointment) {
        return res.status(404).json({ message: "Appointment not found" });
      }

      appointment.prescriptionImage = req.file.filename;
      await appointment.save();

      res.json({
        message: "Prescription uploaded successfully",
        file: req.file.filename,
      });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);

/* =====================================================
   8️⃣ PATIENT → DOWNLOAD PRESCRIPTION
===================================================== */
router.get(
  "/download-prescription/:appointmentId",
  jwtAuthMiddleware,
  async (req, res) => {
    try {
      const appointment = await Appointment.findById(
        req.params.appointmentId
      );

      if (!appointment || !appointment.prescriptionImage) {
        return res.status(404).json({ message: "Prescription not found" });
      }

      const filePath = path.join(
        __dirname,
        "..",
        "uploads",
        "prescriptions",
        appointment.prescriptionImage
      );

      res.download(filePath);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
);




// appointmentRoute.js
// appointmentRoute.js
router.get("/my-appointments-patient", jwtAuthMiddleware, async (req, res) => {
  try {
    // CHANGE THIS: Match how your JWT middleware stores the ID
    const patientId = req.user.id; 

    const appointments = await Appointment.find({ patientId })
      .populate("doctorId", "name specialization hospitalName")
      .sort({ createdAt: -1 });

    console.log(`Found ${appointments.length} appointments for patient: ${patientId}`);
    res.json(appointments);
  } catch (err) {
    console.error("Fetch Error:", err.message);
    res.status(500).json({ error: err.message });
  }
});




 router.get("/my-appointments", jwtAuthMiddleware, async (req, res) => {
   try {
     console.log("Logged in User ID from Token:", req.user.id); // Check this in your VS Code terminal

     const appointments = await Appointment.find({ doctorId: req.user.id })
       .populate("patientId", "name email contactNumber")
       .sort({ createdAt: -1 });

     console.log("Number of appointments found:", appointments.length);
     res.json(appointments);
   } catch (error) {
     console.error("Backend Error:", error);
     res.status(500).json({ error: error.message });
   }
 });











 // GET appointments for the logged-in doctor
 router.get("/by-doctor/:doctorId", async (req, res) => {
   try {
     const appointments = await Appointment.find({
       doctorId: req.params.doctorId,
     })
       .populate("patientId", "name email phone") // Populates patient details
       .sort({ createdAt: -1 });

     res.json(appointments);
   } catch (error) {
     res.status(500).json({ error: error.message });
   }
 });

module.exports = router;

