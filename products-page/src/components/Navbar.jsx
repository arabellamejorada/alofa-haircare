import { FaUserAlt, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "/images/alofa-logo.png";

const Navbar = () => {

  return (
    <header 
      className="bg-white shadow-md py-2px">
        <nav className="container mx-auto flex justify-between items-center px-4 md:py-2 pt-3 pb-2">

          {/* logo */}
          <a href="/"><img src={logo} alt="" /></a>

          {/* navigation pages */}
          <div className="text-lg text-alofa-pink sm:flex items-center gap-8 hidden">
            <Link to="./Home" className="flex items-center gap-2">Home</Link>
            {/* <p>|</p> */}
            <Link to="/login" className="flex items-center gap-2">Products</Link>
            {/* <p>|</p> */}
            <a href="/" className="hover:text-black flex items-center gap-2">FAQs</a>
          </div>

          {/* acc & cart button */}
          <div className="text-lg text-alofa-pink sm:flex items-center gap-4 hidden">
            <a href="/" className="hover:text-black flex items-center gap-2"><FaUserAlt />Login</a>
            <p>|</p>
            <a href="/" className="hover:text-black flex items-center gap-2">Sign Up</a>
            <a href="/"><FaShoppingCart /></a>
          </div>
        </nav>
    </header>

  

  );
}

export default Navbar