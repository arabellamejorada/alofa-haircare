import React from "react";
import Button from "../components/Button";
import Input from "../components/Input";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import "../../src/styles.css";

const Login = () => {
  return (
    <div className="h-screen">
      <div className="flex flex-row h-full">
        {/* Left Side */}
        <div className="flex flex-col justify-between text-white pt-[4rem] w-[60%] bg-alofa-light-pink h-full"></div>
        {/* Right Side */}
        <div className="flex flex-col justify-center p-8 w-[40%]">
          <h2 className="text-2xl font-bold mb-4">Log In</h2>
          <p className="text-gray-600 mb-2">Email:</p>
          <Input
            type="email"
            placeholder="Email Address"
            className="mb-4 p-3 w-full border border-gray-300 rounded-md"
          />
          <p className="text-gray-600 mb-2">Password:</p>
          <Input
            type="password"
            placeholder="Password"
            className="mb-4 p-3 w-full border border-gray-300 rounded-md"
          />
          <Button className="w-full mb-4 py-2 bg-alofa-pink text-white rounded-md font-bold">
            Log In with Email
          </Button>

          <div className="flex flex-row gap-2 items-center">
            <div className="">
              <Checkbox.Root className="CheckboxRoot" defaultChecked id="c1">
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
        </div>
      </div>
    </div>
  );
};

export default Login;
