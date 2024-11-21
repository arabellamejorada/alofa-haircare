// Sidebar.jsx
import React, { useEffect, useState, useContext } from "react";
import classNames from "classnames";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DASHBOARD_SIDEBAR_LINKS,
  PRODUCT_SIDEBAR_LINKS,
  VOUCHER_SIDEBAR_LINKS,
  INVENTORY_SIDEBAR_LINKS,
  ORDERS_SIDEBAR_LINKS,
  EMPLOYEE_SIDEBAR_LINKS,
} from "../lib/consts/navigation";
import { HiOutlineLogout } from "react-icons/hi";
import { supabase } from "../supabaseClient.jsx";
import { AuthContext } from "./AuthContext.jsx";

// Define role IDs (adjust these values to match your actual role IDs)
const ROLE_ADMIN = 2;
// const ROLE_EMPLOYEE = 3;

const linkClasses =
  "flex items-center gap-2 font-light px-3 py-2 hover:bg-alofa-highlight hover:no-underline active:bg-alofa-dark rounded-md text-base";

function SidebarContent({ onClose }) {
  const { signOut } = useContext(AuthContext);
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [userMetadata, setUserMetadata] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      // Get the current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError);
        setLoading(false);
        navigate("/login");
        return;
      }

      if (session && session.user) {
        const user = session.user;

        // Fetch additional profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("first_name, last_name, email, role_id")
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
        } else {
          setUserName(profile.first_name);
          setUserMetadata(profile);
        }
      } else {
        // If no user is logged in, navigate to the login page or handle accordingly
        navigate("/login");
      }

      setLoading(false);
    };

    fetchUserData();
  }, [navigate]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut();
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  const isAdmin = userMetadata && userMetadata.role_id === ROLE_ADMIN;
  // const isEmployee = userMetadata && userMetadata.role_id === ROLE_EMPLOYEE;

  return (
    <>
      <div className="flex flex-col px-1 py-5 mt-5 items-center justify-center">
        <span className="text-white text-7xl font-title">alofa</span>
        <div className="text-alofa-white font-heading">
          {loading ? "Hello!" : userName ? `Hello, ${userName}!` : "Hello!"}
        </div>
      </div>
      <div className="flex-1 px-5 py-8 flex flex-col gap-0.5 overflow-y-auto max-h-screen">
        {/* Render navigation links */}
        {[
          DASHBOARD_SIDEBAR_LINKS,
          PRODUCT_SIDEBAR_LINKS, // Available to both admins and employees
          INVENTORY_SIDEBAR_LINKS,
          ORDERS_SIDEBAR_LINKS,
          isAdmin ? EMPLOYEE_SIDEBAR_LINKS : [], // Admin-only
          isAdmin ? VOUCHER_SIDEBAR_LINKS : [], // Admin-only
        ].map((section, index) =>
          section.length > 0 ? (
            <div key={index} className={index !== 0 ? "pt-5" : ""}>
              {section.map((item) => (
                <SidebarLink key={item.key} item={item} onClick={onClose} />
              ))}
            </div>
          ) : null,
        )}
      </div>

      <div className="flex flex-col px-5 gap-0.5 pt-2 border-t-2 border-alofa-dark mb-2">
        <div
          className={classNames("text-white py-5 cursor-pointer", linkClasses)}
          onClick={handleLogout}
        >
          <span className="text-xl">
            <HiOutlineLogout />
          </span>
          Logout
        </div>
      </div>
    </>
  );
}

function SidebarLink({ item, onClick }) {
  const { pathname } = useLocation();

  return (
    <Link
      to={item.path}
      className={classNames(
        pathname === item.path
          ? "bg-alofa-dark text-white font-bold"
          : "text-white",
        linkClasses,
      )}
      onClick={onClick}
    >
      <span className="text-xl">{item.icon}</span>
      {item.label}
    </Link>
  );
}

export default function Sidebar({ isOpen, onClose }) {
  return (
    <>
      {/* Mobile Sidebar */}
      <div
        className={classNames(
          "fixed inset-0 flex z-40 sm:hidden",
          isOpen ? "" : "hidden",
        )}
      >
        {/* Overlay */}
        <div
          className="fixed inset-0 bg-black bg-opacity-25"
          onClick={onClose}
        ></div>
        {/* Sidebar */}
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-alofa-pink">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none"
              onClick={onClose}
            >
              <span className="sr-only">Close sidebar</span>
            </button>
          </div>
          <SidebarContent onClose={onClose} />
        </div>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden sm:flex sm:flex-shrink-0">
        <div className="w-64 bg-alofa-pink flex flex-col">
          <SidebarContent />
        </div>
      </div>
    </>
  );
}
