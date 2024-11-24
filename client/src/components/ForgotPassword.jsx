import React, { useState } from "react";
import { sendPasswordResetEmail } from "../api/auth";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    try {
      setLoading(true);
      await sendPasswordResetEmail(email);
      toast.success("If the email is registered, a reset link will be sent.");
    } catch (error) {
      toast.error("Failed to send password reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-alofa-pink to-alofa-highlight bg-cover bg-center min-h-screen flex items-center justify-center px-4">
      <div className="bg-white ease-in-out delay-150 duration-300 rounded-md drop-shadow-md p-6 w-full max-w-md hover:drop-shadow-xl hover:scale-105">
        <form onSubmit={handleForgotPassword}>
          <div className="flex flex-col">
            <div className="text-4xl md:text-5xl mb-4 text-center font-heading text-alofa-pink">
              Forgot Password
            </div>

            <p className="text-gray-600 text-center mb-4">
              Enter your email address to receive a password reset link.
            </p>

            <label className="text-gray-600 mb-2" htmlFor="email">
              Email Address:
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="py-2 px-3 mb-4 w-full border border-gray-300 rounded-md focus:outline-alofa-pink transition"
              required
            />

            <div className="mt-5">
              <button
                type="submit"
                className={`w-full text-white py-3 px-4 rounded-md focus:outline-none font-bold ${
                  email
                    ? "bg-gradient-to-b from-[#FE699F] to-[#F8587A]"
                    : "bg-gray-300 cursor-not-allowed"
                } transition`}
                disabled={loading || !email}
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </button>
            </div>

            <div className="mt-4 text-center">
              <a
                href="/login"
                className="text-sm text-alofa-pink hover:underline"
              >
                Back to Login
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
