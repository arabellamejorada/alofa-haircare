import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "./supabaseClient.jsx";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("auth_token") || null,
  );
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to fetch user role based on user ID
  const fetchUserRole = async (userId) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("role_id")
        .eq("id", userId)
        .single();

      if (error) throw error;

      // Set role based on role_id from profiles table
      setRole(data.role_id === 3 ? "employee" : "other");
    } catch (err) {
      console.error("Error fetching role:", err.message);
      setRole(null); // Reset role if error occurs
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (sessionData?.session) {
          // Set token from session and store in localStorage
          setToken(sessionData.session.access_token);
          localStorage.setItem("auth_token", sessionData.session.access_token);

          // Fetch the user's role
          await fetchUserRole(sessionData.session.user.id);
        } else {
          // Clear state if no session is found
          setToken(null);
          setRole(null);
          localStorage.removeItem("auth_token");
        }
      } catch (err) {
        console.error("Error fetching session:", err.message);
        setToken(null);
        setRole(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      setToken(data.session.access_token);
      localStorage.setItem("auth_token", data.session.access_token);

      // Fetch the user's role after successful login
      await fetchUserRole(data.user.id);
    } catch (err) {
      console.error("Error during sign-in:", err.message);
      throw err;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      setToken(null);
      setRole(null);
      localStorage.removeItem("auth_token");
    } catch (err) {
      console.error("Error during sign-out:", err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider value={{ token, role, signIn, signOut, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
