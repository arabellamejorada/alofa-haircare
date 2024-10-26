import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../AuthContext.jsx";

const Login = () => {
  const { signIn } = useContext(AuthContext);
  const navigate = useNavigate();

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
    <div className="bg-gradient-to-b from-pink-400 to-pink-500 bg-cover bg-center min-h-screen">
      <div className="flex h-screen justify-center items-center">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-8">
              <div className="text-5xl mb-4 text-center font-heading text-alofa-pink">
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
                className="mb-4 p-3 w-full border border-gray-300 rounded-md"
                onChange={handleChange}
                required
              />

              <label className="text-gray-600 mb-2" htmlFor="password_input">
                Password:
              </label>
              <input
                type="password"
                id="password_input"
                name="password_input"
                placeholder="Password"
                className="mb-4 p-3 w-full border border-gray-300 rounded-md"
                onChange={handleChange}
                required
              />

              <div className="flex flex-col items-center mt-4">
                <button
                  type="submit"
                  className="w-[12rem] font-extrabold text-white py-2 px-4 rounded-full focus:outline-none bg-gradient-to-b from-[#FE699F] to-[#F8587A]"
                >
                  CONTINUE
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
