import React, { useState } from "react";
import { requestEmailVerification, verifyEmail } from "../services/userService";

const EmailVerification = () => {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleRequestVerification = async () => {
    try {
      const result = await requestEmailVerification();
      setMessage(result.message);
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  const handleVerifyEmail = async (token) => {
    try {
      const result = await verifyEmail(token);
      setMessage(result.message);
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div>
      <button onClick={handleRequestVerification}>
        Send Verification Email
      </button>
      {message && <p className="success">{message}</p>}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default EmailVerification;
