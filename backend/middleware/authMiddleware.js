// Middleware - authMiddleware.js
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const User = require("../models/UserSchema");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select("-password");
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error("Not authorized - Token verification failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized - No token provided");
  }
});

const checkUser = async (req, res, next) => {
  const token = req.cookies.jwt;

  if (token) {
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Find user based on token payload
      const user = await User.findById(decoded.id);

      // Attach user to response locals
      res.locals.user = user;
      next();
    } catch (error) {
      console.error(error.message);
      // Token verification failed
      res.locals.user = null;
      next();
    }
  } else {
    res.locals.user = null;
    next();
  }
};

module.exports = {
  protect,
  checkUser,
};
