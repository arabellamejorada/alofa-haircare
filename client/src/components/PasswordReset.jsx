import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient";

const PasswordReset = () => {
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const accessToken = searchParams.get("access_token");

  useEffect(() => {
    if (!accessToken) {
      setErrorMessage("Invalid or missing reset token. Please try again.");
    }
  }, [accessToken]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = formData;

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (!accessToken) {
      setErrorMessage("Reset token is missing. Please try again.");
      return;
    }

    try {
      setLoading(true);
      setErrorMessage("");
      setSuccessMessage("");

      // Update the password using Supabase
      const { error } = await supabase.auth.updateUser({
        password,
      });

      if (error) throw error;

      setSuccessMessage("Your password has been reset successfully!");
      setTimeout(() => {
        navigate("/login"); // Redirect to login page after a delay
      }, 3000);
    } catch (error) {
      console.error("Password reset error:", error.message);
      setErrorMessage(
        error.message || "An error occurred while resetting your password.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-alofa-pink to-alofa-highlight bg-cover bg-center min-h-screen flex items-center justify-center px-4">
      <div className="bg-white ease-in-out delay-150 duration-300 rounded-md drop-shadow-md p-6 w-full max-w-md hover:drop-shadow-xl hover:scale-105">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <div className="text-4xl md:text-5xl mb-4 text-center font-heading text-alofa-pink">
              Reset Password
            </div>

            {errorMessage && (
              <div className="mb-4 text-red-600 text-center">
                {errorMessage}
              </div>
            )}
            {successMessage && (
              <div className="mb-4 text-green-600 text-center">
                {successMessage}
              </div>
            )}

            <label className="text-gray-600 mb-2" htmlFor="password">
              New Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="New Password"
                value={formData.password}
                onChange={handleChange}
                className="py-2 px-3 w-full border border-gray-300 rounded-md focus:outline-alofa-pink transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-xs text-gray-400 hover:text-gray-600 transition"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <label
              className="text-gray-600 mt-4 mb-2"
              htmlFor="confirmPassword"
            >
              Confirm New Password:
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="py-2 px-3 w-full border border-gray-300 rounded-md focus:outline-alofa-pink transition"
              required
            />

            <div className="mt-5">
              <button
                type="submit"
                disabled={loading || !accessToken}
                className="w-full text-white py-3 px-4 rounded-md focus:outline-none font-bold bg-gradient-to-b from-[#FE699F] to-[#F8587A] transition hover:from-[#F8587A] hover:to-[#FE699F]"
              >
                {loading ? "Resetting..." : "RESET PASSWORD"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
