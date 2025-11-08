require("dotenv").config();
const jwt = require("jsonwebtoken");

const jwtAuthMiddleware = (req, res, next) => {
  let token = req.headers.authorization;
  if (token && token.startsWith("Bearer ")) {
    token = token.slice(7);
  } else {
    token = req.cookies.token;
  }

  if (!token) return res.status(401).json({ error: "Token not found" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token" });
  }
};

const generateToken = (user) => {
  const payload = { id: user._id, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

module.exports = { jwtAuthMiddleware, generateToken };
