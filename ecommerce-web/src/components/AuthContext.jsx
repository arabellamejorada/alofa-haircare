import PropTypes from "prop-types";

import { createContext, useState, useEffect } from "react";
import { supabase } from "../supabaseClient";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("auth_token") || null,
  );

  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || null;
  });

  const [loading, setLoading] = useState(true);
  const [justLoggedIn, setJustLoggedIn] = useState(false);

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
      localStorage.setItem("role", data.role_id === 3 ? "employee" : "other");
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

          // Set the user object
          setUser(sessionData.session.user);
          localStorage.setItem(
            "user",
            JSON.stringify(sessionData.session.user),
          );

          // Fetch the user's role
          await fetchUserRole(sessionData.session.user.id);
        } else {
          // Clear state if no session is found
          setToken(null);
          setUser(null); // Add this line
          setRole(null);
          localStorage.removeItem("auth_token");
          localStorage.removeItem("user");
          localStorage.removeItem("role");
        }
      } catch (err) {
        console.error("Error fetching session:", err.message);
        setToken(null);
        setUser(null);
        setRole(null);
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
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

      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      await fetchUserRole(data.user.id);
      setJustLoggedIn(true);
      return data;
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
      setUser(null); // Add this line
      setRole(null);
      setJustLoggedIn(false);
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      localStorage.removeItem("cartItems");
      localStorage.removeItem("cart_subtotal");
      localStorage.removeItem("checkoutFormDetails");
      localStorage.removeItem("checkoutVoucherCode");
      localStorage.removeItem("checkoutVoucherDiscount");

      console.log("User signed out successfully.");
    } catch (err) {
      console.error("Error during sign-out:", err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role,
        signIn,
        signOut,
        loading,
        justLoggedIn,
        setJustLoggedIn,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
