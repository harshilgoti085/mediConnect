const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("./db");

// Routes
const doctorRoute = require("./routes/doctorRoute");
const pesentRoute = require("./routes/pesentRoute");
const adminRoute = require("./routes/adminRoute");
const appointmentRoute = require("./routes/appointmentRoute");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log("🔌 User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    if (!roomId) return;
    socket.join(roomId);
    console.log(`👥 User joined room: ${roomId}`);
    // Notify the other person in the room that someone joined
    socket.to(roomId).emit("user-joined");
  });

  socket.on("offer", ({ roomId, offer }) => {
    socket.to(roomId).emit("offer", offer);
  });

  socket.on("answer", ({ roomId, answer }) => {
    socket.to(roomId).emit("answer", answer);
  });

  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(roomId).emit("ice-candidate", candidate);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/doctor", doctorRoute);
app.use("/admin", adminRoute);
app.use("/pesent", pesentRoute);
app.use("/appointment", appointmentRoute);

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});