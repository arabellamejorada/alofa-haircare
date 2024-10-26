import React, { useState, useContext } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import AccountCard from "../components/AccountCard";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../supabaseClient.jsx";
import { AuthContext } from "../../../server/AuthContext.jsx"; // Import AuthContext
import "../../src/styles.css";

const Login = () => {
  const { setToken } = useContext(AuthContext); // Access setToken from AuthContext
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
      // Step 1: Authenticate the user using Supabase
      const { data: loginData, error: loginError } =
        await supabase.auth.signInWithPassword({
          email: formData.emailAddress,
          password: formData.password_input,
        });

      if (loginError) throw loginError;

      console.log("Login successful:", loginData);

      // Step 2: Check if the user has a profile in the 'profiles' table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("email", formData.emailAddress)
        .single();

      if (profileError) {
        throw profileError;
      }

      // Step 3: If the profile exists, set the session token and navigate to the home page
      if (profileData) {
        // Set the token in AuthContext
        setToken(loginData.session.access_token);

        // Navigate to the home page or the desired route
        navigate("/");
      } else {
        // Step 4: If no profile is found, prompt the user to complete their profile
        setErrorMessage("No profile data found. Please complete your profile.");
        console.error("No profile data found.");
        // You can also redirect to a profile completion page if needed
        // navigate("/complete-profile");
      }
    } catch (error) {
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
