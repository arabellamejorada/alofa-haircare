import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import AccountCard from "../components/AccountCard";
import { supabase } from "../supabaseClient.jsx";
import "../../src/styles.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    contactNumber: "",
    password_input: "",
  });

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  function handleChange(event) {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    let userId = null; // To store the user ID for potential rollback

    try {
      // Step 1: Sign up the user using Supabase authentication
      const { data: signUpData, error: signUpError } =
        await supabase.auth.signUp({
          email: formData.emailAddress,
          password: formData.password_input,
          options: {
            data: {
              display_name: `${formData.firstName} ${formData.lastName}`, // Set display name
              contact_number: formData.contactNumber, // Set contact number
            },
          },
        });

      if (signUpError) throw signUpError;

      // Get the user ID from the signUpData
      userId = signUpData.user?.id;
      if (!userId) throw new Error("User ID not found after sign-up.");

      // Step 2: Insert user data into the profiles table using the user's UUID
      const { error: profileError } = await supabase
        .from("profiles")
        .insert([
          {
            id: userId, // Use the Supabase-generated user ID
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.emailAddress,
            contact_number: formData.contactNumber,
            role_id: 1, // Set role_id to 1
          },
        ]);

      if (profileError) {
        // Rollback: Delete the user from Supabase auth if profile insertion fails
        await supabase.auth.admin.deleteUser(userId);
        throw new Error(`Error inserting profile: ${profileError.message}`);
      }

      // Step 3: Insert the profile ID into the customer table
      const {  error: customerError } = await supabase
        .from("customer")
        .insert([{ profile_id: userId }]);

      if (customerError) {
        // Rollback: Delete the user and profile from Supabase if customer insertion fails
        await supabase.from("profiles").delete().eq("id", userId);

        await supabase.auth.admin.deleteUser(userId);
        throw new Error(`Error inserting customer: ${customerError.message}`);
      }

      // If all insertions succeed
      setSuccessMessage(
        "Account created successfully! Check your email for verification.",
      );
    } catch (error) {
      setErrorMessage(error.message);
      console.error("Error during sign-up:", error.message);
    }
  }

  return (
    <div className="bg-[url('../../public/images/body-bg.png')] bg-cover bg-center min-h-screen">
      <div className="flex h-screen justify-center">
        <AccountCard>
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col p-8">
              <div className="flex text-5xl mb-4 justify-center font-heading text-alofa-pink">
                Sign Up
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

              <div className="flex gap-2">
                <div className="flex flex-col">
                  <p className="text-gray-600">First Name</p>
                  <Input
                    name="firstName"
                    placeholder="First Name"
                    className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
                    onChange={handleChange}
                  />
                </div>

                <div className="flex flex-col">
                  <p className="text-gray-600">Last Name</p>
                  <Input
                    name="lastName"
                    placeholder="Last Name"
                    className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <p className="text-gray-600">Email</p>
              <Input
                type="email"
                name="emailAddress"
                placeholder="Email Address"
                className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
                onChange={handleChange}
              />

              <p className="text-gray-600">Contact Number</p>
              <Input
                name="contactNumber"
                placeholder="Contact #"
                className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
                onChange={handleChange}
              />

              <p className="text-gray-600">Password</p>
              <Input
                type="password"
                name="password_input"
                placeholder="Password"
                className="p-3 w-full h-[2rem] border border-gray-300 rounded-md"
                onChange={handleChange}
              />

              <div className="flex flex-col items-center mt-2">
                <Button
                  type="submit"
                  className="w-[12rem] font-extrabold font-sans text-white my-1 py-2 px-4 rounded-full focus:outline-none bg-gradient-to-b from-[#FE699F] to-[#F8587A]"
                >
                  CREATE ACCOUNT
                </Button>

                <div className="text-sm flex justify-center gap-1">
                  Already have an account?
                  <Link to="/login" className="underline">
                    Log In
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

export default SignUp;
