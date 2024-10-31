import { useState, useEffect } from 'react';
import { FaUser, FaTags } from 'react-icons/fa';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import ProfileContent from './ProfileContent';
import AddressTab from './AddressTab';
import PurchasesTab from './PurchasesTab';

const CustomerProfile = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // Set the active tab based on the current URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/profile' || path.includes('/profile/address')) {
      setIsAccountOpen(true);
    } else if (path.includes('/profile/purchases')) {
      setIsAccountOpen(false);
    }
  }, [location.pathname]);

  // Handler for opening "My Account" and automatically navigating to "Profile"
  const handleAccountClick = () => {
    if (!isAccountOpen) {
      setIsAccountOpen(true);
      navigate('/profile');
    } else if (location.pathname === '/profile') {
      // Only navigate if not already in a subtab of "My Account"
      navigate('/profile');
    }
  };

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center pt-28 px-4 gap-2 max-w-6xl mx-auto overflow-hidden">
      {/* Sidebar */}
      <aside className="w-full lg:w-1/4 mb-8 lg:mb-0 flex-shrink-0"> 
        {/* User Info */}
        <div className="flex flex-col mb-6">
          <div className="flex items-center">
            <img 
              src="https://via.placeholder.com/80" 
              alt="Profile Placeholder" 
              className="w-16 h-16 rounded-full mr-4 object-cover" 
            />
            <div>
              <p className="text-lg font-medium text-gray-700">
                Welcome, <span className="text-pink-500 font-semibold">Cassey</span>.
              </p>
              <p className="text-sm text-gray-500">Logged in: 26 Oct, 19:54</p>
            </div>
          </div>

          {/* Sidebar Links */}
          <nav className="mt-8">
            <ul className="space-y-4">
              {/* My Account Toggle */}
              <li>
                <button 
                  onClick={handleAccountClick}
                  className={`flex items-center space-x-2 font-semibold w-full focus:outline-none p-3 rounded-md hover:bg-gray-100 transition-colors duration-300 ${
                    isAccountOpen ? 'bg-gray-100 text-pink-500' : 'text-pink-500'
                  }`}
                >
                  <FaUser className="text-pink-500" />
                  <span>My Account</span>
                </button>
                <ul 
                  className={`ml-4 mt-2 space-y-2 overflow-hidden transition-all duration-300 ${
                    isAccountOpen ? 'max-h-40' : 'max-h-0'
                  }`}
                >
                  <li>
                    <Link 
                      to="/profile" 
                      className={`text-sm ${
                        location.pathname === '/profile' ? 'text-pink-500' : 'text-gray-500'
                      } focus:outline-none`}
                    >
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link 
                      to="/profile/address" 
                      className={`text-sm ${
                        location.pathname === '/profile/address' ? 'text-pink-500' : 'text-gray-500'
                      } hover:text-pink-500 focus:outline-none`}
                    >
                      Address
                    </Link>
                  </li>
                </ul>
              </li>

              {/* My Purchases Toggle */}
              <li>
                <Link 
                  to="/profile/purchases"
                  className={`flex items-center space-x-2 font-semibold w-full focus:outline-none p-3 rounded-md hover:bg-gray-100 transition-colors duration-300 ${
                    location.pathname === '/profile/purchases' ? 'bg-gray-100 text-pink-500' : 'text-pink-500'
                  }`}
                >
                  <FaTags className="text-pink-500" />
                  <span>My Purchases</span>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <main className="w-full lg:w-3/4 p-4 bg-gray-100 rounded-lg shadow-md flex-grow">
        <Routes>
          <Route path="" element={<ProfileContent />} />
          <Route path="address" element={<AddressTab />} />
          <Route path="purchases" element={<PurchasesTab />} />
        </Routes>
      </main>
    </div>
  );
};

export default CustomerProfile;