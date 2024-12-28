import jwt from "jsonwebtoken";
import crypto from "node:crypto";

const generateToken = (id) => {
  // Generate a random jti (JWT ID) for token uniqueness
  const jti = crypto.randomBytes(32).toString("hex");

  const payload = {
    id,
    jti,
    iat: Date.now(),
  };

  const options = {
    expiresIn: process.env.JWT_EXPIRY || "30d",
    algorithm: "HS512",
    issuer: process.env.JWT_ISSUER || "hotel-api",
  };

  return jwt.sign(payload, process.env.JWT_SECRET, options);
};

export const generateRefreshToken = (id) => {
  const jti = crypto.randomBytes(32).toString("hex");

  const payload = {
    id,
    jti,
  };

  const options = {
    expiresIn: "90d",
    algorithm: "HS512",
  };

  return jwt.sign(
    payload,
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    options
  );
};

export default generateToken;
