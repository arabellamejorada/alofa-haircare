// Header.jsx
import React, { useEffect, useState } from "react";
import { HiOutlineBell, HiOutlineChatAlt, HiMenu } from "react-icons/hi";
import { FaUserAlt } from "react-icons/fa";
import { Popover, Menu } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient"; // Adjust the path as necessary

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserName = async () => {
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

        // Fetch additional profile data if necessary
        const { data: profile, error: profileError } = await supabase
          .from("profiles") // Replace "profiles" with your table name
          .select("first_name") // Replace "full_name" with the column that contains the user's name
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
        } else {
          setUserName(profile.first_name);
        }
      } else {
        // If no user is logged in, navigate to the login page or handle accordingly
        navigate("/login");
      }

      setLoading(false);
    };

    fetchUserName();
  }, [navigate]);

  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200">
      {/* Hamburger Menu */}
      <button
        className="px-4 border-r border-gray-200 text-gray-700 focus:outline-none focus:bg-gray-100 focus:text-gray-600 sm:hidden"
        onClick={onMenuClick}
      >
        <HiMenu className="h-6 w-6" aria-hidden="true" />
      </button>
      {/* Header Content */}
      <div className="flex-1 flex justify-between px-4 sm:px-6">
        {/* Left Side (empty to keep the layout consistent) */}
        <div className="flex-1 flex"></div>
        {/* Right Side Icons */}
        <div className=" flex items-center gap-2 px-4">
          <FaUserAlt className="text-alofa-pink hover:text-alofa-highlight active:text-alofa-dark size-5" />
          {loading ? "Loading..." : userName ? `Hello, ${userName}!` : "Hello!"}
          {/* ... other components like Popover and Menu */}
        </div>
      </div>
    </div>
  );
}
