/**
 * verifyUser.js
 * Middleware to verify JWT tokens for protected routes.
 * 
 * - Checks for a JWT token in cookies or the Authorization header.
 * - If token is missing or invalid, passes an error to the next middleware.
 * - If valid, attaches the decoded user info to req.user and calls next().
 * 
 * Usage: Add as middleware to routes that require authentication.
 */
const jwt = require("jsonwebtoken");
const { errorHandler } = require("./error");

const verifyToken = (req, res, next) => {
  console.log("Verifying token...");

  // Retrieve token from cookies or Authorization header
  console.log("Cookies:", req.cookies);
  const token = req.cookies.access_token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(errorHandler(401, "Unauthorized: No token provided"));
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(errorHandler(403, "Unauthorized token!"));
    }

    req.user = decoded;
    console.log("Token found:", !!token);
  
    if (!token) return next(errorHandler(401, "Unauthorized"));
  
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        console.log("Token verification error:", err.message);
        return next(errorHandler(403, "Unauthorized token!"));
      }
      console.log("User from token:", user);
      req.user = user;
      next();
    });
  });
};

module.exports = { verifyToken };
