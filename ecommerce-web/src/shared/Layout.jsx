import PropTypes from "prop-types";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div className="pt-20 md:pt-24 px-4 container mx-auto flex flex-col items-center">
        {children}
      </div>
    </>
  );
};

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
