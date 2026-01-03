const jwt = require("jsonwebtoken");

const JWT_SECRET = "DOCTOR_APP_SECRET_12345"; // 🔥 DIRECT SECRET

const jwtAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  let token;

  if (authHeader && authHeader.startsWith("Bearer ")) {
    token = authHeader.split(" ")[1];
  }

  if (!token) {
    console.log("Auth Error: No token provided");
    return res.status(401).json({ error: "Token not found" });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.log("Auth Error:", err.message);
    return res.status(401).json({ error: "Invalid token" });
  }
};

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: "doctor" },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
};

module.exports = { jwtAuthMiddleware, generateToken };
