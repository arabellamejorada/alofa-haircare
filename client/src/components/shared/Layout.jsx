import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Header from "./Header";

// Para dili matandog ang Sidebar and Header while magchange ug route/page
export default function Layout() {
  return (
    <div className="flex flex-row bg-neutral-100 h-screen w-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto">
        <Header />
        {/* Everything except the Outlet component will not change no matter what route you open*/}
        <div className="p-4 ml-2">{<Outlet />}</div>
        {/* <div>Footer</div> */}
      </div>
    </div>
  );
}
