import crypto from "node:crypto";

const hashToken = (token) => {
  // Input validation
  if (!token || typeof token !== "string") {
    throw new Error("Token must be a non-empty string");
  }

  try {
    // Use a more secure hashing algorithm with a salt
    const salt = crypto.randomBytes(16).toString("hex");
    const hash = crypto
      .createHash("sha512")
      .update(token + salt)
      .digest("hex");

    return {
      hash,
      salt,
    };
  } catch (error) {
    throw new Error(`Token hashing failed: ${error.message}`);
  }
};

export const verifyHash = (token, salt, storedHash) => {
  if (!token || !salt || !storedHash) {
    throw new Error("Missing required parameters for hash verification");
  }

  const computedHash = crypto
    .createHash("sha512")
    .update(token + salt)
    .digest("hex");

  return computedHash === storedHash;
};

export default hashToken;
