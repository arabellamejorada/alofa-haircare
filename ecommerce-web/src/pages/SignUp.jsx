
import Button from "../components/Button";
import Input from "../components/Input";
import * as Checkbox from "@radix-ui/react-checkbox";
import { CheckIcon } from "@radix-ui/react-icons";
import AccountCard from "../components/AccountCard";
import "../../src/styles.css";

const SignUp = () => {
  return (
    <div className="bg-[url('../../public/images/body-bg.png')] bg-cover bg-center min-h-screen ">
      <flex className="flex h-screen justify-center">
        <AccountCard>
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
                      type="first_name"
                      placeholder="First Name"
                      className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
                    />
                    <Input
                      type="last_name"
                      placeholder="Last Name"
                      className="mb-4 p-3 w-[10rem] h-[2rem] border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              <p className="text-gray-600">Email:</p>
              <Input
                type="email"
                placeholder="Email Address"
                className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
              />
              <p className="text-gray-600">Contact Number:</p>
              <Input
                type="contact_num"
                placeholder="Contact #"
                className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
              />
              <p className="text-gray-600">Username:</p>
              <Input
                type="username"
                placeholder="Username"
                className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
              />
              <p className="text-gray-600">Password:</p>
              <Input
                type="password"
                placeholder="Password"
                className=" p-3 w-full h-[2rem] border border-gray-300 rounded-md"
              />
              <div className="flex justify-start mt-2 mb-4">
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
              </div>
              <div className="flex flex-col items-center">
                <div className="flex flex-col">
                  <Button className="w-[12rem] font-extrabold font-sans text-white my-1 py-2 px-4 rounded-full focus:outline-none bg-gradient-to-b from-[#FE699F] to-[#F8587A]">
                    CREATE ACCOUNT
                  </Button>
                  <p className="text-sm flex justify-center gap-1">
                    Already have an account?<p className="underline">Log In</p>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </AccountCard>
      </flex>
    </div>
  );
};

export default SignUp;
