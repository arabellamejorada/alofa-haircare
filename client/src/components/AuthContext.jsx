/* Purpose: To manage user authentication, roles, and session persistence in your React application.*/

import React, { createContext, useState, useEffect, useContext } from "react";
import { supabase } from "../supabaseClient.jsx";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("auth_token") || null,
  );
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to check if the profile belongs to an employee or admin
  const fetchUserRole = async (userId) => {
    try {
      // Fetch the role_id from profiles table
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role_id")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      // If role_id is 2 (admin), set the role to admin
      if (profileData.role_id === 2) {
        setRole("admin");
        return "admin";
      }

      // If role_id is 3 (employee), check the employee table
      if (profileData.role_id === 3) {
        const { data: employeeData, error: employeeError } = await supabase
          .from("employee")
          .select("profile_id")
          .eq("profile_id", userId)
          .single();

        if (employeeError) throw employeeError;

        if (employeeData) {
          setRole("employee");
          return "employee";
        } else {
          throw new Error(
            "Access denied. Only employees and admins can log in.",
          );
        }
      }

      // If the user is not an admin or employee, throw an error
      throw new Error("Access denied. Only employees and admins can log in.");
    } catch (err) {
      console.error("Error fetching role:", err.message);
      setRole(null); // Reset role on error
      throw err; // Re-throw error to be handled in signIn
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        setLoading(true);
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();
        if (sessionError) throw sessionError;

        if (sessionData?.session) {
          // Fetch user role and set token if valid
          const userRole = await fetchUserRole(sessionData.session.user.id);
          if (userRole === "employee" || userRole === "admin") {
            setToken(sessionData.session.access_token);
            localStorage.setItem(
              "auth_token",
              sessionData.session.access_token,
            );
          } else {
            setToken(null);
            localStorage.removeItem("auth_token");
          }
        } else {
          setToken(null);
          localStorage.removeItem("auth_token");
        }
      } catch (err) {
        console.error("Error checking session:", err.message);
        setToken(null);
        localStorage.removeItem("auth_token");
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

      // Fetch the user's role and check if the user is an admin or employee
      const userRole = await fetchUserRole(data.user.id);

      // Set token only if the user is an admin or employee
      if (userRole === "employee" || userRole === "admin") {
        setToken(data.session.access_token);
        localStorage.setItem("auth_token", data.session.access_token);
      } else {
        // Clear token if unauthorized
        setToken(null);
        localStorage.removeItem("auth_token");
        throw new Error("Access denied. Only employees and admins can log in.");
      }
    } catch (err) {
      console.error("Error during sign-in:", err.message);

      // Reset token and role on error
      setToken(null);
      setRole(null);
      localStorage.removeItem("auth_token");

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
