import { useState, useEffect, useContext } from "react";
import { FaUser, FaTags } from "react-icons/fa";
import { ClipLoader } from "react-spinners";
import {
  Routes,
  Route,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import ProfileContent from "./ProfileContent";
import AddressTab from "./AddressTab";
import PurchasesTab from "./PurchasesTab";
import { getCustomerByProfileId } from "../../api/customer";
import { AuthContext } from "../../components/AuthContext";

const CustomerProfile = () => {
  const { user } = useContext(AuthContext);
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAccountOpen, setIsAccountOpen] = useState(true);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const data = await getCustomerByProfileId(user.id);
        // console.log("Customer profile data:", data);
        setProfileData(data);
      } catch (error) {
        console.error("Failed to fetch customer profile", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchProfileData();
    }
  }, [user]);

  // Set the active tab based on the current URL
  useEffect(() => {
    const path = location.pathname;
    if (path === "/profile" || path.includes("/profile/address")) {
      setIsAccountOpen(true);
    } else if (path.includes("/profile/purchases")) {
      setIsAccountOpen(false);
    }
  }, [location.pathname]);

  const handleAccountClick = () => {
    if (!isAccountOpen) {
      setIsAccountOpen(true);
      navigate("/profile");
    } else if (location.pathname === "/profile") {
      // Only navigate if not already in a subtab of "My Account"
      navigate("/profile");
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {loading && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-50 pointer-events-none">
          <ClipLoader size={50} color="#E53E3E" loading={loading} />
        </div>
      )}

      <div className="flex flex-col lg:flex-row items-start justify-center pt-28 px-1 gap-1 max-w-6xl mx-auto overflow-hidden">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/5 mb-8 lg:mb-0 flex-shrink-0">
          {/* User Info */}
          <div className="flex flex-col mb-6">
            <div className="flex items-center">
            <div className="w-16 h-16 rounded-full mr-4 bg-gray-100 flex items-center justify-center">
              <FaUser className="text-alofa-pink w-8 h-8" />
            </div>
              <div>
                <p className="text-lg font-medium text-gray-700">
                  Hello,{" "}
                  <span className="text-alofa-pink font-semibold">
                    {profileData ? profileData.profiles.first_name : ""}
                  </span>
                </p>
                <p className="text-sm text-gray-500 italic">
                  Customer
                </p>
              </div>
            </div>

            {/* Sidebar Links */}
            <nav className="mt-8">
              <ul className="-space-y-0">
                {/* My Account Toggle */}
                <li>
                  <button
                    onClick={handleAccountClick}
                    className={`flex items-center space-x-1 font-semibold w-full focus:outline-none p-3 rounded-md hover:bg-gray-100 transition-colors duration-300 ${
                      isAccountOpen
                        ? "bg-gray-100 text-alofa-pink"
                        : "text-alofa-pink"
                    }`}
                  >
                    <FaUser className="text-alofa-pink" />
                    <span>My Account</span>
                  </button>
                  <ul
                    className={`ml-4 mt-2 space-y-2 overflow-hidden transition-all duration-300 ${
                      isAccountOpen ? "max-h-40" : "max-h-0"
                    }`}
                  >
                    <li>
                      <Link
                        to="/profile"
                        className={`text-sm ${
                          location.pathname === "/profile"
                            ? "text-alofa-pink"
                            : "text-gray-500"
                        } focus:outline-none`}
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/profile/address"
                        className={`text-sm ${
                          location.pathname === "/profile/address"
                            ? "text-alofa-pink"
                            : "text-gray-500"
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
                    className={`flex items-center space-x-1 font-semibold w-full focus:outline-none p-3 rounded-md hover:bg-gray-100 transition-colors duration-300 ${
                      location.pathname === "/profile/purchases"
                        ? "bg-gray-100 text-alofa-pink"
                        : "text-alofa-pink"
                    }`}
                  >
                    <FaTags className="text-alofa-pink" />
                    <span>My Purchases</span>
                  </Link>
                </li>
              </ul>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="w-full lg:w-3/4 p-7 flex-grow min-w-[900px]">
          <Routes>
            <Route
              path=""
              element={
                profileData ? (
                  <ProfileContent
                    profileData={profileData}
                    setProfileData={setProfileData}
                  />
                ) : null
              }
            />
            <Route
              path="address"
              element={
                profileData ? <AddressTab profileData={profileData} /> : null
              }
            />
            <Route
              path="purchases"
              element={<PurchasesTab profileData={profileData} />}
            />
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default CustomerProfile;
