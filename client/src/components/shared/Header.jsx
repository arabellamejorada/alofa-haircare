// Header.jsx
import React, { Fragment } from "react";
import { HiOutlineBell, HiOutlineChatAlt, HiMenu } from "react-icons/hi";
import { FaUserAlt } from "react-icons/fa";
import { Popover, Transition, Menu } from "@headlessui/react";
import classNames from "classnames";
import { useNavigate } from "react-router-dom";

export default function Header({ onMenuClick }) {
  const navigate = useNavigate();

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
        {/* Left Side (empty to keep the layout consistent) */}
        <div className="flex-1 flex"></div>
        {/* Right Side Icons */}
        <div className="ml-4 flex items-center gap-2">
          <FaUserAlt className="text-alofa-pink hover:text-alofa-highlight active:text-alofa-dark size-6"></FaUserAlt>
          Hello, Employee!
          <Popover className="relative">{/* ... */}</Popover>
          <Popover className="relative">{/* ... */}</Popover>
          <Menu as="div" className="relative">
            {/* ... */}
          </Menu>
        </div>
      </div>
    </div>
  );
}
