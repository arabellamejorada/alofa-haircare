import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ClipLoader } from "react-spinners";
import { updateCustomerProfile } from "../../api/customer";

const ProfileContent = ({ profileData }) => {
  const [editableProfileData, setEditableProfileData] = useState({
    firstName: profileData?.profiles.first_name || "",
    lastName: profileData?.profiles.last_name || "",
    email: profileData?.profiles.email || "",
    contactNumber: profileData?.profiles.contact_number || "",
    updated_at: profileData?.updated_at || "",
    // password: "********",
  });

  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    contactNumber: false,
    password: false,
  });

  const [lastUpdated, setLastUpdated] = useState(profileData?.updated_at);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profileData) {
      setEditableProfileData({
        firstName: profileData.profiles.first_name || "",
        lastName: profileData.profiles.last_name || "",
        email: profileData.profiles.email || "",
        contactNumber: profileData.profiles.contact_number || "",
        updated_at: profileData.updated_at || "",
      });

      setLastUpdated(
        new Date().toLocaleString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true, // This enables 12-hour format with AM/PM
        }),
      );
    }
  }, [profileData]);

  const handleEditToggle = (fields) => {
    setIsEditing((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async (e) => {
    e.preventDefault();

    if (!profileData.customer_id) {
      console.log(profileData);
      console.error("Customer ID is undefined. Cannot update profile.");
      return;
    }

    const updatedProfile = {
      first_name: editableProfileData.firstName,
      last_name: editableProfileData.lastName,
      email: editableProfileData.email,
      contact_number: editableProfileData.contactNumber,
      role_id: profileData.profiles.role_id,
      updated_at: new Date().toISOString(),
    };

    try {
      setLoading(true);
      console.log("Saving profile data:", updatedProfile);
      console.log("Customer ID:", profileData.customer_id);
      await updateCustomerProfile(profileData.customer_id, updatedProfile);

      // Reset the state after saving
      setIsEditing({
        firstName: false,
        lastName: false,
        contactNumber: false,
        password: false,
      });

      console.log("Profile data saved:", updatedProfile);
    } catch (error) {
      console.error("Error saving profile data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle password visibility
  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="relative">
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 pointer-events-none">
          <ClipLoader size={50} color="#E53E3E" loading={loading} />
        </div>
      )}
      <div className="px-8 py-5 lg:px-8">
        <h2 className="bg-gradient-to-b from-alofa-pink via-alofa-pink to-alofa-light-pink bg-clip-text text-transparent font-extrabold text-4xl mb-2">
          My Profile
        </h2>
        <p className="text-sm text-gray-500 mb-8">
          Last updated: {lastUpdated || "N/A"}
        </p>

        {/* Profile Form Component */}
        <form className="space-y-6 pr-8" onSubmit={handleSaveChanges}>
          {/* Name Fields */}
          <div className="flex items-center space-x-4 w-full">
            <label
              htmlFor="firstName"
              className="text-gray-700 w-1/4 text-right"
            >
              Name
            </label>
            <div className="flex w-full space-x-4">
              <input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="First Name"
                value={editableProfileData.firstName}
                onChange={handleInputChange}
                readOnly={!isEditing.firstName}
                className={`p-3 border rounded-md w-1/2 ${
                  isEditing.firstName
                    ? "border-pink-500 bg-white text-black"
                    : "border-gray-300 bg-gray-200 text-gray-600 cursor-not-allowed"
                }`}
              />
              <input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Last Name"
                value={editableProfileData.lastName}
                onChange={handleInputChange}
                readOnly={!isEditing.lastName}
                className={`p-3 border rounded-md w-1/2 ${
                  isEditing.lastName
                    ? "border-pink-500 bg-white text-black"
                    : "border-gray-300 bg-gray-200 text-gray-600 cursor-not-allowed"
                }`}
              />
            </div>
            <button
              type="button"
              onClick={() =>
                handleEditToggle({ firstName: true, lastName: true })
              }
              className="text-pink-500 hover:underline ml-2"
            >
              Edit
            </button>
          </div>

          {/* Email Field */}
          <div className="flex items-center space-x-4 w-full">
            <label htmlFor="email" className="text-gray-700 w-1/4 text-right">
              Email
            </label>
            <div className="flex flex-col w-full">
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Email Address"
                value={editableProfileData.email}
                readOnly={!isEditing.email}
                className={`p-3 border rounded-md w-full ${
                  isEditing.email
                    ? "border-pink-500 bg-white text-black"
                    : "border-gray-300 bg-gray-200 text-gray-600 cursor-not-allowed"
                }`}
              />
            </div>
            <button
              type="button"
              onClick={() => handleEditToggle({ email: false })}
              className="text-pink-500 hover:underline ml-2"
            >
              Edit
            </button>
          </div>

          {/* Contact Number Field */}
          <div className="flex items-center space-x-4 w-full">
            <label
              htmlFor="contactNumber"
              className="text-gray-700 w-1/4 text-right"
            >
              Contact Number
            </label>
            <div className="flex flex-col w-full">
              <input
                id="contactNumber"
                name="contactNumber"
                type="text"
                placeholder="Contact Number (+63)"
                value={editableProfileData.contactNumber}
                onChange={handleInputChange}
                readOnly={!isEditing.contactNumber}
                className={`p-3 border rounded-md w-full ${
                  isEditing.contactNumber
                    ? "border-pink-500 bg-white text-black"
                    : "border-gray-300 bg-gray-200 text-gray-600 cursor-not-allowed"
                }`}
              />
            </div>
            <button
              type="button"
              onClick={() => handleEditToggle({ contactNumber: true })}
              className="text-pink-500 hover:underline ml-2"
            >
              Edit
            </button>
          </div>

          {/* Password Field */}
          <div className="flex items-center space-x-4 w-full">
            <label
              htmlFor="password"
              className="text-gray-700 w-1/4 text-right"
            >
              Password
            </label>
            <div className="flex flex-col w-full relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={editableProfileData.password}
                onChange={handleInputChange}
                readOnly={!isEditing.password}
                className={`p-3 border rounded-md w-full pr-12 ${
                  isEditing.password
                    ? "border-pink-500 bg-white text-black"
                    : "border-gray-300 bg-gray-200 text-gray-600 cursor-not-allowed"
                }`}
              />
              {isEditing.password && (
                <button
                  type="button"
                  onClick={handlePasswordToggle}
                  className="absolute inset-y-0 right-0 px-3 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleEditToggle({ password: true })}
              className="text-pink-500 hover:underline ml-2"
            >
              Edit
            </button>
          </div>

          {/* Save Changes Button */}
          <div className="flex justify-end w-full">
            <button
              type="submit"
              className="mt-6 px-8 py-3 text-white font-semibold rounded-full shadow-md bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F]"
            >
              SAVE CHANGES
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

ProfileContent.propTypes = {
  profileData: PropTypes.shape({
    profiles: PropTypes.shape({
      first_name: PropTypes.string,
      last_name: PropTypes.string,
      email: PropTypes.string,
      contact_number: PropTypes.string,
      role_id: PropTypes.number,
    }),
    updated_at: PropTypes.string,
    customer_id: PropTypes.number,
  }),
};

export default ProfileContent;
