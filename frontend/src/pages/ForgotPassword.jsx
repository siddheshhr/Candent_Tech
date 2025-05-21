import React, { useState } from "react";
import { Alert } from "flowbite-react";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:3000/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage(data.message || "Password reset link sent to your email.");
      } else {
        setError(data.message || "Failed to send reset link.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h1 className="login-title">Forgot Password</h1>
        <form onSubmit={handleSubmit}>
          <div className="login-input-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
          {message && <Alert color="success" className="mt-4">{message}</Alert>}
          {error && <Alert color="failure" className="mt-4">{error}</Alert>}
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;