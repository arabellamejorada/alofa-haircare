import React from "react";
import classNames from "classnames";
import { BsFlower1 } from "react-icons/bs";
import { Link, useLocation } from "react-router-dom";
import {
  DASHBOARD_SIDEBAR_BOTTOM_LINKS,
  DASHBOARD_SIDEBAR_LINKS,
} from "../lib/consts/navigation";
import { HiOutlineLogout } from "react-icons/hi";

const linkClasses =
  "flex items-center gap-2 font-light px-3 py-2 hover:bg-pink-400 hover:no-underline active:bg-pink-600 rounded-xl text-base";

export default function Sidebar() {
  return (
    <div className="bg-pink-500 w-20% p-3 flex flex-col text-white">
      <div className="flex items-center gap-2 px-1 py-5 justify-center">
        <BsFlower1 fontSize={50} />
        <spn className="text-white text-xl">Alofa Haircare</spn>
      </div>
      <div className="flex-1 py-8 flex flex-col gap-0.5">
        {DASHBOARD_SIDEBAR_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}
      </div>
      <div className="flex flex-col gap-0.5 pt-2 border-t-2 border-pink-400">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((item) => (
          <SidebarLink key={item.key} item={item} />
        ))}
        <div className={classNames("text-pink-50 py-5", linkClasses)}>
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
        linkClasses
      )}
    >
      <span className="text-xl">{item.icon}</span>
      {item.label}
    </Link>
  );
}
