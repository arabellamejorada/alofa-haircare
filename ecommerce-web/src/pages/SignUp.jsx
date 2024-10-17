import React from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import "../../src/styles.css";

const SignUp = () => {
  return (
    <div className="h-screen">
      <div className="flex flex-row h-screen">
        {/* Left Side */}
        <div className="flex flex-col justify-between text-white pt-[4rem] w-[60%] bg-alofa-light-pink h-full"></div>
        {/* Right Side */}
        <div className="flex flex-col justify-center p-8 w-[40%]">
          <div className="flex flex-col mb-4">
            <h2 className="text-2xl font-bold">Create an account</h2>
            {/* <p className="text-md text-gray-600">
              Enter the details below to create your account
            </p> */}
          </div>
          <div className="mb-4">
            <label className="text-gray-600" htmlFor="create_email">
              Email Address:
            </label>
            <Input
              type="email"
              name="create_email"
              placeholder="name@example.com"
              className="mb-4 p-3 w-full border border-gray-300 rounded-md"
            />
            <label htmlFor="create_password">Password:</label>
            <Input
              type="password"
              name="create_password"
              placeholder="Password"
              className="mb-2 p-3 w-full border border-gray-300 rounded-md"
            />
            <div className="flex flex-row gap-2 items-center mb-2">
              <div className="">
                <Checkbox.Root className="CheckboxRoot" defaultChecked id="c1">
                  <Checkbox.Indicator className="CheckboxIndicator">
                    <CheckIcon />
                  </Checkbox.Indicator>
                </Checkbox.Root>
              </div>
              <div>
                <label className="text-xs leading-3" htmlFor="c1">
                  I agree to the Terms of Service and Privacy Policy.
                </label>
              </div>
            </div>
          </div>
          <Button className="w-full mb-4 py-2 bg-alofa-pink text-white rounded-md font-bold">
            Create Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
