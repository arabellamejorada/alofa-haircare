// Import necessary modules
import React, { createContext, useState, useEffect } from "react";

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthProvider component
export const AuthProvider = ({ children }) => {
  // Store session token
  const [token, setToken] = useState(null);

  // Save token to sessionStorage whenever it changes
  useEffect(() => {
    if (token) {
      sessionStorage.setItem("token", JSON.stringify(token));
    } else {
      sessionStorage.removeItem("token");
    }
  }, [token]);

  // Load token from sessionStorage when the app initializes
  useEffect(() => {
    const storedToken = sessionStorage.getItem("token");
    if (storedToken) {
      setToken(JSON.parse(storedToken));
    }
  }, []);

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};
