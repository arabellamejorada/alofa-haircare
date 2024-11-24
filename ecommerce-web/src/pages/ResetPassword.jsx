import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "../supabaseClient";
import { toast } from "sonner";
import AccountCard from "../components/AccountCard";
import Button from "../components/Button";
import Input from "../components/Input";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("access_token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    if (!accessToken) {
      toast.error("Invalid or missing reset token. Please try again.");
      return;
    }

    try {
      setLoading(true);
      const { error } = await supabase.auth.updateUser({
        password,
        access_token: accessToken,
      });

      if (error) throw error;

      toast.success("Password reset successful. You can now log in.");
    } catch (error) {
      toast.error("Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[url('../../public/images/body-bg.png')] bg-cover bg-center min-h-screen">
      <div className="flex h-screen justify-center">
        <AccountCard>
          <form onSubmit={handlePasswordReset}>
            <div className="flex flex-col p-8">
              <div className="flex text-5xl mb-4 justify-center font-heading text-alofa-pink">
                Reset Password
              </div>
              <p className="text-sm text-gray-600 mb-4 text-center">
                Enter your new password below.
              </p>

              <label className="text-gray-600 mb-2" htmlFor="password">
                New Password
              </label>
              <Input
                type="password"
                id="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mb-4 p-3 w-full border border-gray-300 rounded-md"
                required
              />

              <label className="text-gray-600 mb-2" htmlFor="confirmPassword">
                Confirm New Password
              </label>
              <Input
                type="password"
                id="confirmPassword"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </AccountCard>
      </div>
    </div>
  );
};

export default ResetPassword;
