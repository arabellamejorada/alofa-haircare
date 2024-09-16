import { FaUserAlt, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "/images/alofa-logo.png";

const Navbar = () => {

  return (
    <header 
      className="bg-white/75 shadow-md py-2px fixed top-0 w-full z-50">
        <nav className="container mx-auto flex justify-between items-center px-4 md:py-2 pt-3 pb-2">

          <div className="flex items-center gap-8">
            {/* logo */}
            <a href="/"><img src={logo} alt="" /></a>

            {/* navigation pages */}
            <div className="text-lg font-semibold text-alofa-pink sm:flex items-center gap-8 hidden">
              
              <Link to="/" className="hover:text-pink-700 items-baseline gap-2 pl-3">Home</Link>
              {/* <p>|</p> */}
              <Link to="/products" className="hover:text-pink-700 flex items-baseline gap-2">Products</Link>
              {/* <p>|</p> */}
              <Link to="/frequently-asked-questions" className="hover:text-pink-700 flex items-baseline gap-2">FAQs</Link>
            </div>
          </div>
    

          {/* acc & cart button */}
          <div className="text-lg text-alofa-pink sm:flex items-center gap-4 hidden">
            <p><FaUserAlt /></p>
            <a href="/" className="hover:text-pink-700 flex items-center gap-2">Login</a>
            <p>|</p>
            <a href="/" className="hover:text-pink-700 flex items-center gap-2">Sign Up</a>
            <Link to="/shoppingcart" className="flex items-center gap-5">
                <div className="text-[#FE699F] p-3 rounded-full transition-colors duration-300 hover:bg-[#FE699F] hover:text-white">
                <FaShoppingCart/>
                </div>
            </Link>
          </div>
        </nav>
    </header>
  );
}

export default Navbar