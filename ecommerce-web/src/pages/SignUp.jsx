import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import { Link } from "react-router-dom";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import AccountCard from "../components/AccountCard";
import { supabase } from "../client.jsx";
import "../../src/styles.css";

const SignUp = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    contactNumber: "",
    username_input: "",
    password_input: "",
  });

  console.log(formData);

  function handleChange(event) {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [event.target.name]: event.target.value,
      };
    });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.emailAddress,
        password: formData.password_input,
        options: {
          data: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            contactNumber: formData.contactNumber,
            username: formData.username_input,
          },
        },
      });
      if (error) throw error;
      alert("Check your email for verification link.");
    } catch (error) {
      alert(error.message);
    }
  }

  return (
    <div className="bg-[url('../../public/images/body-bg.png')] bg-cover bg-center min-h-screen ">
      <div className="flex h-screen justify-center">
        <AccountCard>
          <form onSubmit={handleSubmit}>
            {" "}
            <div className="flex flex-col p-8">
              <div className="">
                <div className="flex text-5xl mb-4 justify-center font-heading text-alofa-pink">
                  Sign Up
                </div>
                <div className="flex gap-2">
                  <div className="flex flex-col">
                    <p className="text-gray-600">Name:</p>
                    <div className="flex gap-2">
                      <Input
                        name="firstName"
                        placeholder="First Name"
                        className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
                        onChange={handleChange}
                      />
                      <Input
                        name="lastName"
                        placeholder="Last Name"
                        className="mb-4 p-3 w-[10rem] h-[2rem] border border-gray-300 rounded-md"
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>
                <p className="text-gray-600">Email:</p>
                <Input
                  type="email"
                  name="emailAddress"
                  placeholder="Email Address"
                  className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
                  onChange={handleChange}
                />
                <p className="text-gray-600">Contact Number:</p>
                <Input
                  name="contactNumber"
                  placeholder="Contact #"
                  className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
                  onChange={handleChange}
                />
                <p className="text-gray-600">Username:</p>
                <Input
                  name="username_input"
                  placeholder="Username"
                  className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
                  onChange={handleChange}
                />
                <p className="text-gray-600">Password:</p>
                <Input
                  type="password"
                  name="password_input"
                  placeholder="Password"
                  className=" p-3 w-full h-[2rem] border border-gray-300 rounded-md"
                  onChange={handleChange}
                />
                {/* <div className="flex justify-start mt-2 mb-4">
                  <div className="flex flex-row gap-2 items-center">
                    <div className="">
                      <Checkbox.Root
                        className="CheckboxRoot"
                        defaultChecked
                        id="c1"
                      >
                        <Checkbox.Indicator className="CheckboxIndicator">
                          <CheckIcon />
                        </Checkbox.Indicator>
                      </Checkbox.Root>
                    </div>
                    <div>
                      <label className="Label text-sm" htmlFor="c1">
                        Accept terms and conditions.
                      </label>
                    </div>
                  </div>
                </div> */}
                <div className="flex flex-col items-center mt-2">
                  <div className="flex flex-col">
                    <Button
                      type="submit"
                      className="w-[12rem] font-extrabold font-sans text-white my-1 py-2 px-4 rounded-full focus:outline-none bg-gradient-to-b from-[#FE699F] to-[#F8587A]"
                    >
                      CREATE ACCOUNT
                    </Button>
                  </div>
                  <div className="text-sm flex justify-center gap-1">
                    Already have an account?
                    <Link to="/login" className="underline">
                      Log In
                    </Link>
                  </div>
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
