const mongoose = require("mongoose");
require("dotenv").config();

const mongoURI =
  process.env.MONGO_URI || "mongodb://127.0.0.1:27017/mediconnect";

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

module.exports = mongoose;
