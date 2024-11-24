import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    emailAddress: "",
    password_input: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Call signIn from AuthContext
      await signIn(formData.emailAddress, formData.password_input);
      // Navigate to home if login is successful
      navigate("/");
    } catch (error) {
      // Set error message if login fails
      setErrorMessage(
        error.message || "An error occurred during login. Please try again.",
      );
      console.error("Login error:", error.message);
    }
  };

  return (
    <div className="bg-gradient-to-b from-alofa-pink to-alofa-highlight bg-cover bg-center min-h-screen flex items-center justify-center px-4">
      <div className="bg-white ease-in-out delay-150 duration-300 rounded-md drop-shadow-md p-6 w-full max-w-md hover:drop-shadow-xl hover:scale-105">
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col">
            <div className="text-4xl md:text-5xl mb-4 text-center font-heading text-alofa-pink">
              Log In
            </div>

            {errorMessage && (
              <div className="mb-4 text-red-600 text-center">
                {errorMessage}
              </div>
            )}

            <label className="text-gray-600 mb-2" htmlFor="emailAddress">
              Email:
            </label>
            <input
              type="email"
              id="emailAddress"
              name="emailAddress"
              placeholder="Email Address"
              className="mb-4 py-2 px-3 w-full border border-gray-300 rounded-md focus:outline-alofa-pink transition"
              onChange={handleChange}
              required
            />

            <label className="text-gray-600 mb-2" htmlFor="password_input">
              Password:
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password_input"
                name="password_input"
                placeholder="Password"
                className="py-2 px-3 w-full border border-gray-300 rounded-md focus:outline-alofa-pink transition"
                onChange={handleChange}
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

            {/* Forgot Password Link */}
            <div className="text-right mt-2">
              <Link
                to="/forgot-password"
                className="text-sm text-alofa-pink hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <div className="mt-5">
              <button
                type="submit"
                className="w-full text-white py-3 px-4 rounded-md focus:outline-none font-bold bg-gradient-to-b from-[#FE699F] to-[#F8587A] transition hover:from-[#F8587A] hover:to-[#FE699F]"
              >
                CONTINUE
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;