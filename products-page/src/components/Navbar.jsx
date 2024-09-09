import { FaUserAlt, FaShoppingCart } from "react-icons/fa";
import logo from "/images/alofa-logo.png";

const Navbar = () => {

  return (
    <header className="bg-white shadow-md py-4">
        <nav className="container mx-auto flex justify-between items-center px-4 md:py-4 pt-6 pb-3">

          {/* logo */}
          <a href="/"><img src={logo} alt="" /></a>

          {/* navigation pages */}
          <div className="text-lg text-alofa-pink sm:flex items-center gap-8 hidden">
            <a href="/" className="flex items-center gap-2">Home</a>
            <p>|</p>
            <a href="/" className="flex items-center gap-2">Products</a>
            <p>|</p>
            <a href="/" className="flex items-center gap-2">FAQs</a>
          </div>

          {/* acc & cart button */}
          <div className="text-lg text-alofa-pink sm:flex items-center gap-4 hidden">
            <a href="/" className="flex items-center gap-2"><FaUserAlt />Login</a>
            <p>|</p>
            <a href="/" className="flex items-center gap-2"> Sign Up</a>
            <a href="/"><FaShoppingCart /></a>
          </div>
        </nav>
    </header>
  )
}

export default Navbar