import { FaUser, FaTags } from 'react-icons/fa';

const CustomerProfile = () => {
  return (
    <div className="ml-20 mr-20 flex flex-col lg:flex-row pt-20 px-10">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4 mb-8 lg:mb-0 lg:mr-8">
        {/* User Info */}
        <div className="flex flex-col items-start mb-6">
          <div className="w-20 h-20 rounded-full bg-pink-300 flex items-center justify-center mb-4">
            <span className="text-white text-4xl">👤</span>
          </div>
          <p className="text-lg font-medium text-gray-700">
            Welcome, <span className="text-pink-500 font-semibold">Cassey</span>.
          </p>
          <p className="text-sm text-gray-500">Logged in: 26 Oct, 19:54</p>
        </div>

        {/* Sidebar Links */}
        <nav className="w-full">
          <ul className="space-y-4">
            <li>
              <button className="flex items-center space-x-2 text-gray-700 font-semibold hover:text-pink-500 w-full focus:outline-none">
                <FaUser className="text-pink-500" />
                <span>My Account</span>
              </button>
              {/* Sub-links */}
              <ul className="ml-8 mt-2 space-y-2">
                <li>
                  <button className="text-sm text-pink-500 focus:outline-none">Profile</button>
                </li>
                <li>
                  <button className="text-sm text-gray-500 hover:text-pink-500 focus:outline-none">Address</button>
                </li>
              </ul>
            </li>
            <li>
              <button className="flex items-center space-x-2 text-gray-700 font-semibold hover:text-pink-500 w-full focus:outline-none">
                <FaTags className="text-pink-500" />
                <span>My Purchases</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Profile Tab */}
      <main className="w-full lg:w-3/4 p-6 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-semibold text-pink-500 mb-4">My Profile</h2>
        <p className="text-sm text-gray-500 mb-8">Last updated: 16 Oct 2024 22:54</p>
        
        <form className="space-y-6">
          <div className="flex flex-col">
            <label htmlFor="name" className="text-gray-700 mb-2">Name</label>
            <input id="name" type="text" className="p-3 border rounded-md" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="email" className="text-gray-700 mb-2">Email</label>
            <input id="email" type="email" className="p-3 border rounded-md" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="contactNumber" className="text-gray-700 mb-2">Contact Number</label>
            <input id="contactNumber" type="text" className="p-3 border rounded-md" />
          </div>

          <div className="flex flex-col">
            <label htmlFor="password" className="text-gray-700 mb-2">Password</label>
            <input id="password" type="password" className="p-3 border rounded-md" />
          </div>

          <div className="flex items-center">
            <div className="w-20 h-20 rounded-full bg-pink-300 flex items-center justify-center mr-6">
              <span className="text-white text-4xl">👤</span>
            </div>
            <div>
              <label htmlFor="profilePicture" className="text-gray-700 block mb-2">Profile Picture</label>
              <input id="profilePicture" type="file" accept="image/jpeg, image/png" className="block text-sm text-gray-500" />
              <p className="text-xs text-gray-500 mt-1">File size: maximum 1 MB</p>
              <p className="text-xs text-gray-500">File extension: JPEG, PNG</p>
            </div>
          </div>

          <button type="submit" className="px-6 py-3 bg-pink-500 text-white font-semibold rounded-lg shadow-md hover:bg-pink-600 focus:outline-none">
            SAVE CHANGES
          </button>
        </form>
      </main>
    </div>
  );
};

export default CustomerProfile;
