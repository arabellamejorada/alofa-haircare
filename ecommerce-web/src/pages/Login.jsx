import React, { useState, useContext } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import AccountCard from "../components/AccountCard";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { CartContext } from "../components/CartContext"; // Import CartContext for merging
import { mergeCarts } from "../api/cart.js"; // Import mergeCarts API
import "../../src/styles.css";

const Login = () => {
  const { token, setToken, signIn } = useContext(AuthContext);
  const { cartId, fetchCart } = useContext(CartContext); // Add fetchCart
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailAddress: "",
    password_input: "",
  });

  const [errorMessage, setErrorMessage] = useState("");

  function handleChange(event) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      // Step 1: Use signIn from AuthContext to handle login
      const data = await signIn(formData.emailAddress, formData.password_input);

      // No need to check for 'error' here; 'signIn' will throw an error if one occurs

      const customerProfileId = data.user.id;

      // No need to call 'setToken' here if 'signIn' handles it
      // Remove 'setToken(data);' unless you need it for a specific reason

      // Merge guest cart with logged-in cart
      if (cartId) {
        console.log("Attempting to merge carts:", cartId, customerProfileId);
        await mergeCarts(cartId, customerProfileId);
        console.log("Carts merged successfully.");
        sessionStorage.removeItem("guest_cart_id");
      }

      await fetchCart(); // Fetch the cart for the logged-in user after merging

      console.log("Login successful:", data);

      // Navigate to the desired route
      navigate("/");
    } catch (error) {
      // Set error message if login fails
      setErrorMessage(error.message);
      console.error("Login error:", error.message);
    }
  }

  return (
    <div className="bg-[url('../../public/images/body-bg.png')] bg-cover bg-center min-h-screen">
      <div className="flex h-screen justify-center">
        <AccountCard>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col p-8">
              <div className="flex text-5xl mb-4 justify-center font-heading text-alofa-pink">
                Log In
              </div>

              {errorMessage && (
                <div className="mb-4 text-red-600 text-center">
                  {errorMessage}
                </div>
              )}

              <p className="text-gray-600">Email:</p>
              <Input
                type="email"
                name="emailAddress"
                placeholder="Email Address"
                className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
                onChange={handleChange}
                required
              />

              <p className="text-gray-600">Password:</p>
              <Input
                type="password"
                name="password_input"
                placeholder="Password"
                className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
                onChange={handleChange}
                required
              />

              <div className="flex flex-col items-center">
                <Button
                  type="submit"
                  className="w-[12rem] font-extrabold font-sans text-white my-1 py-2 px-4 rounded-full focus:outline-none bg-gradient-to-b from-[#FE699F] to-[#F8587A]"
                >
                  CONTINUE
                </Button>

                <div className="text-sm gap-1">
                  Don't have an account?{" "}
                  <Link to="/signup" className="underline">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </form>
        </AccountCard>
      </div>
    </div>
  );
};

export default Login;
