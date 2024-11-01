// Header.jsx
import React, { useEffect, useState } from "react";
import { HiOutlineBell, HiOutlineChatAlt, HiMenu } from "react-icons/hi";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { FaUserCircle } from "react-icons/fa";

import Modal from "../modal/Modal"; // Adjust the import path as necessary

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [userMetadata, setUserMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setModalVisible] = useState(false);

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
          .from("profiles") // Replace "profiles" with your table name
          .select("first_name, last_name, email, role_id") // Add any additional fields you want
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

  // Function to handle opening the modal
  const handleOpenModal = () => {
    setModalVisible(true);
  };

  // Function to handle closing the modal
  const handleCloseModal = () => {
    setModalVisible(false);
  };

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
        <div className="flex-1 flex"></div>
        {/* Right Side Icons */}
        <div className="flex items-center gap-2 px-4">
          <FaUserAlt
            className="text-alofa-pink hover:text-alofa-highlight active:text-alofa-dark size-5 cursor-pointer"
            onClick={handleOpenModal}
          />
        </div>
      </div>
      {/* Modal */}
      <Modal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        backdropClassName="bg-black bg-opacity-20 backdrop-blur-sm drop-shadow-md"
      >
        {userMetadata ? (
          <div className="p-4">
            <div className="flex flex-col font-heading text-alofa-pink text-[3rem] mb-6">
              <div className="mb-6">Profile</div>
              <div className="flex justify-center">
                <FaUserCircle className="text-[8rem] text-alofa-pink" />
              </div>
            </div>

            <div className="flex flex-col gap-1 w-[rem]">
              {/* <div className="text-gray-400 font-semibold text-lg">
                User Information
              </div> */}
              <div className="flex gap-[4rem]">
                <div className="flex flex-col gap-2">
                  <div>
                    <div className="font-semibold text-gray-600">Name:</div>{" "}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-600">Email:</div>{" "}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-600">Position:</div>{" "}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex justify-end text-gray-400 font-light">
                    {userMetadata.first_name} {userMetadata.last_name}{" "}
                  </div>
                  <div className="flex justify-end text-gray-400 font-light">
                    {userMetadata.email}{" "}
                  </div>
                  <div className="flex justify-end text-gray-400 font-light">
                    {userMetadata.role_id === 2
                      ? "Admin"
                      : userMetadata.role_id === 3
                        ? "Employee"
                        : "User"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <p>Loading user information...</p>
        )}
      </Modal>
    </div>
  );
}
