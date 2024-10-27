import { useState, useEffect } from 'react';
import { FaUser, FaTags } from 'react-icons/fa';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import ProfileContent from './ProfileContent';
import AddressTab from './AddressTab';
import PurchasesTab from './PurchasesTab';

const CustomerProfile = () => {
  const [isAccountOpen, setIsAccountOpen] = useState(true);
  const [isPurchasesOpen, setIsPurchasesOpen] = useState(false);
  const location = useLocation();

  // Set the active tab based on the current URL
  useEffect(() => {
    const path = location.pathname;
    if (path === '/profile' || path.includes('/profile/address')) {
      setIsAccountOpen(true);
      setIsPurchasesOpen(false);
    } else if (path.includes('/profile/purchases')) {
      setIsAccountOpen(false);
      setIsPurchasesOpen(true);
    }
  }, [location.pathname]);

  return (
    <div className="flex flex-col lg:flex-row items-start justify-center pt-28 px-4 gap-2 max-w-6xl mx-auto">
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
                  onClick={() => setIsAccountOpen(!isAccountOpen)}
                  className="flex items-center space-x-2 text-pink-500 font-semibold w-full focus:outline-none"
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
                <button 
                  onClick={() => setIsPurchasesOpen(!isPurchasesOpen)}
                  className="flex items-center space-x-2 text-pink-500 font-semibold w-full focus:outline-none"
                >
                  <FaTags className="text-pink-500" />
                  <span>My Purchases</span>
                </button>
                <ul 
                  className={`ml-4 mt-2 space-y-2 overflow-hidden transition-all duration-300 ${
                    isPurchasesOpen ? 'max-h-20' : 'max-h-0'
                  }`}
                >
                  <li>
                    <Link 
                      to="/profile/purchases" 
                      className={`text-sm ${
                        location.pathname === '/profile/purchases' ? 'text-pink-500' : 'text-gray-500'
                      } focus:outline-none`}
                    >
                      Purchases
                    </Link>
                  </li>
                </ul>
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
