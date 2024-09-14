import { Outlet } from "react-router-dom";
// import Navbar from "./Navbar.jsx";
// import Footer from "./Footer.jsx";

const Layout = () => {
  return (
    <div>
      {/* <Navbar /> */}
      <main>
        <Outlet />  {/* This is where the child routes (like Home, Products) will render */}
      </main>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
