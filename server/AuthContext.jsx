import React, { createContext, useState, useEffect } from "react";
import { supabase } from "../ecommerce-web/src/supabaseClient.jsx";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [role, setRole] = useState(null); // New state to store user role

  // On component mount, load token from sessionStorage if available
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  // Fetch user role from Supabase whenever the token changes
  useEffect(() => {
    const fetchUserRole = async () => {
      if (token) {
        // Fetch the current user
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // If the user exists, fetch their role from the 'profiles' table
        if (user) {
          const { data, error } = await supabase
            .from("profiles")
            .select("role_id")
            .eq("id", user.id) // Match the user by their ID
            .single();

          if (error) {
            console.error("Error fetching user role:", error.message);
          } else {
            // Check if role_id corresponds to employee (assuming role_id = 3 for employees)
            setRole(data.role_id === 3 ? "employee" : "other"); // Adjust this if needed
            console.log("Fetched role_id:", data.role_id); // Debugging log
          }
        }
      } else {
        setRole(null); // Reset role if not logged in
      }
    };

    fetchUserRole();
  }, [token]);

  // Save token to sessionStorage whenever it changes
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", token);
    } else {
      sessionStorage.removeItem("token");
    }
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, setToken, role }}>
      {children}
    </AuthContext.Provider>
  );
};
