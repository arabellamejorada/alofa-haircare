
import Button from "../components/Button";
import Input from "../components/Input";
// import * as Checkbox from "@radix-ui/react-checkbox";
// import { CheckIcon } from "@radix-ui/react-icons";
import AccountCard from "../components/AccountCard";
import "../../src/styles.css";

const Login = () => {
  return (
    <div className="bg-[url('../../public/images/body-bg.png')] bg-cover bg-center min-h-screen ">
      <flex className="flex h-screen justify-center">
        <AccountCard>
          {" "}
          <div className="flex flex-col p-8">
            <div className="">
              <div className="flex text-5xl mb-4 justify-center font-heading text-alofa-pink">
                Log In
              </div>
              <p className="text-gray-600">Email:</p>
              <Input
                type="email"
                placeholder="Email Address"
                className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
              />
              <p className="text-gray-600">Password:</p>
              <Input
                type="password"
                placeholder="Password"
                className="mb-4 p-3 w-full h-[2rem] border border-gray-300 rounded-md"
              />
              <div className="flex flex-col items-center">
                <div>
                  <Button className=" w-[12rem] font-extrabold font-sans text-white my-1 py-2 px-4 rounded-full focus:outline-none bg-gradient-to-b from-[#FE699F] to-[#F8587A]">
                    CONTINUE
                  </Button>
                  <div className="text-sm flex justify-center underline">
                    Forgot Password?
                  </div>
                </div>
              </div>
            </div>
          </div>
        </AccountCard>
      </flex>
    </div>
  );
};

export default Login;
