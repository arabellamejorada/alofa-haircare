// Header.jsx
import React, { useEffect, useState } from "react";
import { HiMenu } from "react-icons/hi";
import { FaUserAlt } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import { ClipLoader } from "react-spinners";
import Modal from "../modal/Modal"; // Adjust the import path as necessary
import { toast } from "sonner";

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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true); // Start loading

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
      } catch (error) {
        console.error("Unexpected error fetching user data:", error);
      } finally {
        setLoading(false); // End loading
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
    // Add necessary validations
    if (!formData.first_name || formData.first_name.trim() === "") {
      toast.error("First name cannot be empty.");
      return;
    }
    if (!formData.last_name || formData.last_name.trim() === "") {
      toast.error("Last name cannot be empty.");
      return;
    }
    if (!formData.email || formData.email.trim() === "") {
      toast.error("Email cannot be empty.");
      return;
    }
    // Optionally, validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    // If password is being changed, add validation
    if (formData.password && formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long.");
      return;
    }

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
      toast.success("Profile updated successfully.");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Error updating profile: " + error.message);
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
      <Modal
        isVisible={isModalVisible}
        onClose={handleCloseModal}
        backdropClassName="bg-black bg-opacity-20 backdrop-blur-sm drop-shadow-md"
      >
        {loading ? (
          <div className="flex items-center justify-center p-20">
            <ClipLoader size={50} color={"#E53E3E"} loading={true} />
          </div>
        ) : userMetadata ? (
          <div className="p-6 max-w-lg mx-auto">
            {/* Modal Header */}
            <div className="flex flex-row items-center mb-6 gap-2">
              <h2 className="text-3xl font-black text-alofa-pink">
                Employee Profile
              </h2>
            </div>

            {/* Profile Fields */}
            <div className="space-y-4">
              {/* First Name */}
              <div className="flex items-center">
                <label className="w-32 font-bold text-gray-700">
                  First Name:
                </label>
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alofa-pink"
                  />
                ) : (
                  <span className="flex-1 text-gray-500">
                    {userMetadata.first_name}
                  </span>
                )}
              </div>

              {/* Last Name */}
              <div className="flex items-center">
                <label className="w-32 font-bold text-gray-700">
                  Last Name:
                </label>
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alofa-pink"
                  />
                ) : (
                  <span className="flex-1 text-gray-500">
                    {userMetadata.last_name}
                  </span>
                )}
              </div>

              {/* Email */}
              <div className="flex items-center">
                <label className="w-32 font-bold text-gray-700">Email:</label>
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alofa-pink"
                  />
                ) : (
                  <span className="flex-1 text-gray-500">
                    {userMetadata.email}
                  </span>
                )}
              </div>

              {/* Position */}
              <div className="flex items-center">
                <label className="w-32 font-bold text-gray-700">
                  Position:
                </label>
                <span className="flex-1 text-gray-500">
                  {userMetadata.role_id === 2
                    ? "Admin"
                    : userMetadata.role_id === 3
                      ? "Employee"
                      : "User"}
                </span>
              </div>

              {/* Password (Only when Editing) */}
              {isEditing && (
                <div className="flex items-center">
                  <label className="w-32 font-bold text-gray-700">
                    Password:
                  </label>
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
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-alofa-pink"
                  />
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-4">
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-4 py-2 bg-alofa-pink text-white font-semibold rounded-lg hover:bg-alofa-dark transitio"
                >
                  Edit
                </button>
              ) : (
                <>
                  <button
                    onClick={handleSave}
                    className="px-4 py-2 bg-alofa-pink text-white font-semibold rounded-lg hover:bg-alofa-dark transitio"
                  >
                    Save
                  </button>
                  <button
                    onClick={handleCancel}
                    className="px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center p-20">
            <ClipLoader size={50} color={"#E53E3E"} loading={true} />
          </div>
        )}
      </Modal>
    </div>
  );
}
