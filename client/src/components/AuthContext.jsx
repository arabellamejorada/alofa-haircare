import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
} from "react";
import { supabase } from "../supabaseClient.jsx";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(
    () => localStorage.getItem("auth_token") || null,
  );
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);

  const fetchUserRole = useCallback(async (userId) => {
    try {
      // Fetch the profile data, including role_id
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role_id")
        .eq("id", userId)
        .single();

      if (profileError) throw profileError;

      // Fetch the employee details, including employee_id
      const { data: employeeData, error: employeeError } = await supabase
        .from("employee")
        .select("employee_id, profile_id")
        .eq("profile_id", userId)
        .single();

      if (employeeError && employeeError.code !== "PGRST116") {
        // Ignore "No rows found" error (code PGRST116), but throw others
        throw employeeError;
      }

      // Set the employeeId if available
      setEmployeeId(employeeData ? employeeData.employee_id : null);

      // Determine the role based on role_id
      switch (profileData.role_id) {
        case 2:
          setRole("admin");
          return "admin";
        case 3:
          setRole("employee");
          return "employee";
        default:
          throw new Error(
            "Access denied. Only employees and admins can log in.",
          );
      }
    } catch (err) {
      console.error("Error fetching role:", err.message);
      setRole(null);
      setEmployeeId(null);
      throw err;
    }
  }, []);

  const checkSession = useCallback(async () => {
    try {
      setLoading(true);
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError) throw sessionError;

      if (sessionData?.session) {
        const userRole = await fetchUserRole(sessionData.session.user.id);
        if (userRole === "employee" || userRole === "admin") {
          setToken(sessionData.session.access_token);
          localStorage.setItem("auth_token", sessionData.session.access_token);

          const { data: userDetails } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", sessionData.session.user.id)
            .single();
          setUser(userDetails);
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
  }, [fetchUserRole]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const signIn = async (email, password) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;

      const userRole = await fetchUserRole(data.user.id);

      if (userRole === "employee" || userRole === "admin") {
        setToken(data.session.access_token);
        localStorage.setItem("auth_token", data.session.access_token);
        await checkSession();
      } else {
        setToken(null);
        localStorage.removeItem("auth_token");
        throw new Error("Access denied. Only employees and admins can log in.");
      }
    } catch (err) {
      console.error("Error during sign-in:", err.message);
      setToken(null);
      setRole(null);
      setUser(null);
      setEmployeeId(null);
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
      setUser(null);
      setEmployeeId(null);
      localStorage.removeItem("auth_token");
    } catch (err) {
      console.error("Error during sign-out:", err.message);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, role, user, employeeId, signIn, signOut, loading }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};
