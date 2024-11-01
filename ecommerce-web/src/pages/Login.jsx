import React, { useState, useContext } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import AccountCard from "../components/AccountCard";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../components/AuthContext";
import { CartContext } from "../components/CartContext";
import { mergeCarts } from "../api/cart.js";
import "../../src/styles.css";
import { ClipLoader } from "react-spinners";

const Login = () => {
  const { signIn, setJustLoggedIn } = useContext(AuthContext);
  const { cartId, setCartId } = useContext(CartContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailAddress: "",
    password_input: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(event) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      setLoading(true);

      // Step 1: Use signIn from AuthContext to handle login
      const data = await signIn(formData.emailAddress, formData.password_input);
      const customerProfileId = data.user.id;

      // Step 2: Merge guest cart with logged-in cart if a guest cart exists
      if (cartId) {
        await mergeCarts(cartId, customerProfileId);
        console.log("Cart merged successfully.");
        sessionStorage.removeItem("guest_cart_id");
        setCartId(null);
      }

      // Set the "justLoggedIn" flag in AuthContext
      setJustLoggedIn(true);

      // Step 3: Navigate after login and cart merge
      navigate("/");
      console.log("Login successful:", data);
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Login error:", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative">
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 pointer-events-none">
          <ClipLoader size={50} color="#E53E3E" loading={loading} />
        </div>
      )}

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

                <div className="flex flex-col items-center gap-2">
                  <Button
                    type="submit"
                    className="w-full font-extrabold font-sans text-white my-1 py-2 px-4 rounded-md focus:outline-none bg-gradient-to-b from-[#FE699F] to-[#F8587A]"
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
    </div>
  );
};

export default Login;
