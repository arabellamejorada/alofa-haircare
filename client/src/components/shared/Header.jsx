// Header.jsx
import React, { useEffect, useState } from "react";
import { HiMenu } from "react-icons/hi";
import { FaUserAlt, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

import Modal from "../modal/Modal"; // Adjust the import path as necessary

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();
  const [userMetadata, setUserMetadata] = useState(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [sessionUser, setSessionUser] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      // Get the current session
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession();

      if (sessionError) {
        console.error("Error getting session:", sessionError);
        navigate("/login");
        return;
      }

      if (session && session.user) {
        const user = session.user;
        setSessionUser(user); // Store the session user for later use

        // Fetch additional profile data
        const { data: profile, error: profileError } = await supabase
          .from("profiles") // Replace "profiles" with your table name
          .select("first_name, last_name, email, role_id") // Add any additional fields you want
          .eq("id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching user profile:", profileError);
        } else {
          setUserMetadata(profile);
          setFormData({
            first_name: profile.first_name,
            last_name: profile.last_name,
            email: profile.email,
            password: "",
          });
        }
      } else {
        // If no user is logged in, navigate to the login page or handle accordingly
        navigate("/login");
      }
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
    setIsEditing(false); // Reset editing state when closing the modal
  };

  const handleSave = async () => {
    try {
      if (!sessionUser) throw new Error("User not authenticated");

      const user = sessionUser;
      const display_name =
        `${formData.first_name} ${formData.last_name}`.trim();
      const additionalMetadata = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        // Add more fields as needed
      };

      // Update the user's email and/or password in Supabase Auth
      const updates = {
        data: { display_name, additionalMetadata }, // Include display_name in user_metadata
      };
      if (formData.email !== user.email) {
        updates.email = formData.email;
      }
      if (formData.password) {
        updates.password = formData.password;
      }

      if (Object.keys(updates).length > 0) {
        const { data, error: authUpdateError } =
          await supabase.auth.updateUser(updates);
        if (authUpdateError) {
          throw authUpdateError;
        } else {
          // Update the sessionUser with the new data
          setSessionUser(data.user);
        }
      }

      // Update the profiles table
      const { error: updateError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
        })
        .eq("id", user.id);

      if (updateError) throw updateError;

      // Fetch the updated profile data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("first_name, last_name, email, role_id")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      setUserMetadata(profile);
      setIsEditing(false);
      alert("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Error updating profile: " + error.message);
    }
  };

  const handleCancel = () => {
    setFormData({
      first_name: userMetadata.first_name,
      last_name: userMetadata.last_name,
      email: userMetadata.email,
      password: "",
    });
    setIsEditing(false);
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

            <div className="flex flex-col gap-6">
              {/* Profile Fields */}
              <div className="grid items-center gap-4 grid-cols-[0.5fr_1fr]">
                <div className="font-semibold text-gray-600 w-[15rem]">
                  First Name:
                </div>
                <div className="flex justify-end">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.first_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          first_name: e.target.value,
                        })
                      }
                      placeholder="First Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  ) : (
                    <span className="text-gray-800">
                      {userMetadata.first_name}
                    </span>
                  )}
                </div>

                <div className="font-semibold text-gray-600 w-[15rem]">
                  Last Name:
                </div>
                <div className="flex justify-end">
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.last_name}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          last_name: e.target.value,
                        })
                      }
                      placeholder="Last Name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  ) : (
                    <span className="text-gray-800">
                      {userMetadata.last_name}
                    </span>
                  )}
                </div>

                <div className="font-semibold text-gray-600 w-[15rem]">
                  Email:
                </div>
                <div className="flex justify-end">
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          email: e.target.value,
                        })
                      }
                      placeholder="Email"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                    />
                  ) : (
                    <span className="text-gray-800">{userMetadata.email}</span>
                  )}
                </div>

                <div className="font-semibold text-gray-600 w-[15rem]">
                  Position:
                </div>
                <div className="flex justify-end">
                  <span className="text-gray-800">
                    {userMetadata.role_id === 2
                      ? "Admin"
                      : userMetadata.role_id === 3
                        ? "Employee"
                        : "User"}
                  </span>
                </div>

                {isEditing && (
                  <>
                    <div className="font-semibold text-gray-600 w-[15rem]">
                      Password:
                    </div>
                    <div className="flex justify-end">
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            password: e.target.value,
                          })
                        }
                        placeholder="New Password"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                      />
                    </div>
                  </>
                )}
              </div>

              {/* Edit and Save/Cancel Buttons */}
              <div className="flex justify-end gap-4">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 text-gray-500 hover:text-alofa-pink "
                  >
                    Edit
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="px-4 py-2 bg-alofa-pink text-white font-semibold rounded-lg hover:bg-alofa-dark transition"
                    >
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
                    >
                      Cancel
                    </button>
                  </>
                )}
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
