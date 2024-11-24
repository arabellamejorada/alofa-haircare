import { supabase } from "../supabaseClient";

export const sendPasswordResetEmail = async (email) => {
  try {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "https://localhost:5173/reset-password", // Replace with your frontend reset URL
    });
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error sending password reset email:", error.message);
    throw error;
  }
};
