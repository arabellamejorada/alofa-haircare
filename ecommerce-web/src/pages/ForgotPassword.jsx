import { useState } from "react";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import AccountCard from "../components/AccountCard";
import Button from "../components/Button";
import Input from "../components/Input";
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email address.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: "http://localhost:5173/reset-password", // Update for production
      });

      if (error) throw error;

      toast.success("If the email is registered, a reset link has been sent.");
    } catch (error) {
      toast.error("Failed to send reset link. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[url('../../public/images/body-bg.png')] bg-cover bg-center min-h-screen">
      <div className="flex h-screen justify-center">
        <AccountCard>
          <form onSubmit={handleForgotPassword}>
            <div className="flex flex-col p-8">
              <div className="flex text-5xl mb-4 justify-center font-heading text-alofa-pink">
                Forgot Password
              </div>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Enter your email address to receive a password reset link.
              </p>

              <label className="text-gray-600 mb-2" htmlFor="email">
                Email Address
              </label>
              <Input
                type="email"
                id="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 p-3 w-full border border-gray-300 rounded-md"
                required
              />

              <Button
                type="submit"
                className={`w-full font-extrabold font-sans text-white py-2 px-4 rounded-md focus:outline-none bg-gradient-to-b from-[#FE699F] to-[#F8587A] ${
                  loading ? "opacity-75" : ""
                }`}
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Reset Email"}
              </Button>

              {/* Back Button */}
              <Button
                type="button"
                onClick={() => navigate(-1)}
                className="mt-4 w-full font-extrabold font-sans text-white py-2 px-4 rounded-md focus:outline-none bg-gray-500 hover:bg-gray-700"
              >
                Back
              </Button>
            </div>
          </form>
        </AccountCard>
      </div>
    </div>
  );
};

export default ForgotPassword;
