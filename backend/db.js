const mongoose = require("mongoose");

const MONGO_URL = "mongodb://127.0.0.1:27017/mediconnect";

mongoose
  .connect(MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

module.exports = mongoose;
