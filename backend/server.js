const express = require("express");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const cors = require("cors");
require("./db"); // MongoDB connection

const doctorRoute = require("./routes/doctorRoute");
const pesentRoute = require("./routes/pesentRoute");
const adminRoute = require("./routes/adminRoute");

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5174", // your React app’s URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Routes
app.use("/Doctor", doctorRoute);
app.use("/Admin", adminRoute);
app.use("/Pesent", pesentRoute);

// Default route
app.get("/", (req, res) => {
  res.send("🚀 MediConnect Backend Running Successfully!");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`💥 MediConnect server started on port ${PORT}`)
);
