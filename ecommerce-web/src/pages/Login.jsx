import React, { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import AccountCard from "../components/AccountCard";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "../client.jsx";
import "../../src/styles.css";

const Login = ({ setToken }) => {
  let navigate = useNavigate();

  const [formData, setFormData] = useState({
    emailAddress: "",
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
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.emailAddress,
        password: formData.password_input,
      });

      if (error) throw error;
      console.log(data);
      setToken(data);
      navigate("/");
    } catch (error) {
      alert(error);
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
                  Log In
                </div>
                <p className="text-gray-600">Email:</p>
                <Input
                  type="email"
                  name="emailAddress"
                  placeholder="Email Address"
                  className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
                  onChange={handleChange}
                />
                <p className="text-gray-600">Password:</p>
                <Input
                  type="password"
                  name="password_input"
                  placeholder="Password"
                  className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
                  onChange={handleChange}
                />
                <div className="flex flex-col items-center">
                  <div className="flex">
                    <Button
                      type="submit"
                      className="w-[12rem] font-extrabold font-sans text-white my-1 py-2 px-4 rounded-full focus:outline-none bg-gradient-to-b from-[#FE699F] to-[#F8587A]"
                    >
                      CONTINUE
                    </Button>
                  </div>
                  <div className="text-sm gap-1">
                    Don't have an account?{" "}
                    <Link to="/signup" className="underline">
                      Sign Up
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

export default Login;
