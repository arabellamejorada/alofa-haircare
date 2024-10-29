import React, { useContext } from "react";
import classNames from "classnames";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
  DASHBOARD_SIDEBAR_LINKS,
  PRODUCT_SIDEBAR_LINKS,
  VOUCHER_SIDEBAR_LINKS,
  INVENTORY_SIDEBAR_LINKS,
  EMPLOYEE_SIDEBAR_LINKS,
} from "../lib/consts/navigation";
import { HiOutlineLogout } from "react-icons/hi";
import { AuthContext } from "../AuthContext.jsx"; // Import AuthContext

const linkClasses =
  "flex items-center gap-2 font-light px-3 py-2 hover:bg-pink-400 hover:no-underline active:bg-pink-600 rounded-xl text-base";

export default function Sidebar() {
  const { signOut } = useContext(AuthContext); // Access signOut from AuthContext
  const navigate = useNavigate();

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(); // Call the signOut function from AuthContext
      navigate("/login"); // Redirect to login page after logout
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <div className="bg-gradient-to-b from-pink-400 to-pink-500 w-[18%] p-3 flex flex-col text-white drop-shadow-[0_0px_5px_rgba(0,0,0,0.6)]">
      <div className="flex flex-col px-1 py-5 mt-5 items-center justify-center">
        <span className="text-white text-7xl font-title">Alofa</span>
      </div>
      <div className="flex-1 px-5 py-8 flex flex-col gap-0.5">
        <div>
          {DASHBOARD_SIDEBAR_LINKS.map((item) => (
            <SidebarLink key={item.key} item={item} />
          ))}
        </div>
        <div className="pt-5">
          {PRODUCT_SIDEBAR_LINKS.map((item) => (
            <SidebarLink key={item.key} item={item} />
          ))}
        </div>
        <div className="pt-5">
          {VOUCHER_SIDEBAR_LINKS.map((item) => (
            <SidebarLink key={item.key} item={item} />
          ))}
        </div>
        <div className="pt-5">
          {INVENTORY_SIDEBAR_LINKS.map((item) => (
            <SidebarLink key={item.key} item={item} />
          ))}
        </div>
        <div className="pt-5">
          {EMPLOYEE_SIDEBAR_LINKS.map((item) => (
            <SidebarLink key={item.key} item={item} />
          ))}
        </div>
      </div>

      <div className="flex flex-col px-5 gap-0.5 pt-2 border-t-2 border-pink-400">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}
        <div
          className={classNames(
            "text-pink-50 py-5 cursor-pointer",
            linkClasses,
          )}
          onClick={handleLogout} // Add logout functionality here
        >
          <span className="text-xl">
            <HiOutlineLogout />
          </span>
          Logout
        </div>
      </div>
    </div>
  );
}

function SidebarLink({ item }) {
  const { pathname } = useLocation();

  return (
    <Link
      to={item.path}
      className={classNames(
        pathname === item.path
          ? "bg-pink-400 text-pink-50 font-bold"
          : "text-pink-100",
        linkClasses,
      )}
    >
      <span className="text-xl">{item.icon}</span>
      {item.label}
    </Link>
  );
}
