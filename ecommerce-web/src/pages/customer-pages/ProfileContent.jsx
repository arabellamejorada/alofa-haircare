import { useState } from 'react';

const ProfileContent = () => {
  // State for each input field and edit mode
  const [isEditing, setIsEditing] = useState({
    firstName: false,
    lastName: false,
    email: false,
    contactNumber: false,
    password: false,
  });

  // State for field values
  const [profileData, setProfileData] = useState({
    firstName: 'Cassey',
    lastName: 'Gempesaw',
    email: 'catgempesaw@gmail.com',
    contactNumber: '09123456789',
    password: '********',
  });

  // State to store the last updated timestamp
  const [lastUpdated, setLastUpdated] = useState(null);

  // State for password visibility
  const [showPassword, setShowPassword] = useState(false);

  // Handler to toggle edit mode
  const handleEditToggle = (fields) => {
    setIsEditing((prev) => ({
      ...prev,
      ...fields,
    }));
  };

  // Handler to change input values
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handler to save changes and update the last updated timestamp
  const handleSaveChanges = (e) => {
    e.preventDefault();

    // Reset all edit states to false after saving
    setIsEditing({
      firstName: false,
      lastName: false,
      email: false,
      contactNumber: false,
      password: false,
    });

    // Update the last updated timestamp
    const currentTimestamp = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
    setLastUpdated(currentTimestamp);
  };

  // Handler to toggle password visibility
  const handlePasswordToggle = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="px-8 py-5 lg:px-8">
      <h2 className="bg-gradient-to-b from-alofa-pink via-alofa-pink to-alofa-light-pink bg-clip-text text-transparent font-extrabold text-4xl mb-2">My Profile</h2>
      <p className="text-sm text-gray-500 mb-8">
        Last updated: {lastUpdated ? lastUpdated : 'Never'}
      </p>

      {/* Profile Form Component */}
      <form className="space-y-6 pr-8" onSubmit={handleSaveChanges}>
        {/* Name Fields */}
        <div className="flex items-center space-x-4 w-full">
          <label htmlFor="firstName" className="text-gray-700 w-1/4 text-right">Name</label>
          <div className="flex w-full space-x-4">
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First Name"
              value={profileData.firstName}
              onChange={handleInputChange}
              readOnly={!isEditing.firstName}
              className={`p-3 border rounded-md w-1/2 ${
                isEditing.firstName
                  ? 'border-pink-500 bg-white text-black'
                  : 'border-gray-300 bg-gray-200 text-gray-600 cursor-not-allowed'
              }`}
            />
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last Name"
              value={profileData.lastName}
              onChange={handleInputChange}
              readOnly={!isEditing.lastName}
              className={`p-3 border rounded-md w-1/2 ${
                isEditing.lastName
                  ? 'border-pink-500 bg-white text-black'
                  : 'border-gray-300 bg-gray-200 text-gray-600 cursor-not-allowed'
              }`}
            />
          </div>
          <button
            type="button"
            onClick={() => handleEditToggle({ firstName: true, lastName: true })}
            className="text-pink-500 hover:underline ml-2"
          >
            Edit
          </button>
        </div>

        {/* Email Field */}
        <div className="flex items-center space-x-4 w-full">
          <label htmlFor="email" className="text-gray-700 w-1/4 text-right">Email</label>
          <div className="flex flex-col w-full">
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Email Address"
              value={profileData.email}
              onChange={handleInputChange}
              readOnly={!isEditing.email}
              className={`p-3 border rounded-md w-full ${
                isEditing.email
                  ? 'border-pink-500 bg-white text-black'
                  : 'border-gray-300 bg-gray-200 text-gray-600 cursor-not-allowed'
              }`}
            />
          </div>
          <button
            type="button"
            onClick={() => handleEditToggle({ email: true })}
            className="text-pink-500 hover:underline ml-2"
          >
            Edit
          </button>
        </div>

        {/* Contact Number Field */}
        <div className="flex items-center space-x-4 w-full">
          <label htmlFor="contactNumber" className="text-gray-700 w-1/4 text-right">Contact Number</label>
          <div className="flex flex-col w-full">
            <input
              id="contactNumber"
              name="contactNumber"
              type="text"
              placeholder="Contact Number (+63)"
              value={profileData.contactNumber}
              onChange={handleInputChange}
              readOnly={!isEditing.contactNumber}
              className={`p-3 border rounded-md w-full ${
                isEditing.contactNumber
                  ? 'border-pink-500 bg-white text-black'
                  : 'border-gray-300 bg-gray-200 text-gray-600 cursor-not-allowed'
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
          <label htmlFor="password" className="text-gray-700 w-1/4 text-right">Password</label>
          <div className="flex flex-col w-full relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              value={profileData.password}
              onChange={handleInputChange}
              readOnly={!isEditing.password}
              className={`p-3 border rounded-md w-full pr-12 ${
                isEditing.password
                  ? 'border-pink-500 bg-white text-black'
                  : 'border-gray-300 bg-gray-200 text-gray-600 cursor-not-allowed'
              }`}
            />
            {isEditing.password && (
              <button
                type="button"
                onClick={handlePasswordToggle}
                className="absolute inset-y-0 right-0 px-3 text-sm text-gray-500 hover:text-gray-700 focus:outline-none"
              >
                {showPassword ? 'Hide' : 'Show'}
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
  );
};

export default ProfileContent;
