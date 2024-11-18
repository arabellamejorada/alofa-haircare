import { FaFacebookF, FaInstagram, FaTiktok, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="relative">
      
      {/* Footer Section */}
      <footer
        className="bg-[#FF82AF] text-white pt-1 pb-2 shadow-md"
      >
        <div className="container mx-auto px-3 lg:px-3 mt-9">
          <div className="flex flex-col lg:flex-row justify-between items-center lg:items-start">
            {/* Logo Section */}
            <div className="mb-6 lg:mb-0">
              <h1 className="text-7xl font-title">alofa</h1>
            </div>

            {/* Follow Us and Contact Us Section */}
            <div className="flex flex-col lg:flex-row lg:gap-20 items-center lg:items-start mb-6 lg:mb-0">
              {/* Follow Us Section */}
              <div className="mb-6 lg:mb-0">
                <h2 className="text-lg font-semibold mb-2">Follow Us</h2>
                <ul>
                  <li className="flex items-center mb-1">
                    <FaFacebookF className="mr-2" /> <a href="https://www.facebook.com/profile.php?id=100083016888414" target="_blank" rel="noopener noreferrer">Facebook</a>
                  </li>
                  <li className="flex items-center mb-1">
                    <FaInstagram className="mr-2" /> <a href="https://www.instagram.com/alofahaircare/" target="_blank" rel="noopener noreferrer">Instagram</a>
                  </li>
                  <li className="flex items-center">
                    <FaTiktok className="mr-2" /> <a href="">Tiktok</a>
                  </li>
                </ul>
              </div>

              {/* Contact Us Section */}
              <div>
                <h2 className="text-lg font-semibold mb-2">Contact Us</h2>
                <ul>
                  <li className="flex items-center mb-1">
                    <FaPhoneAlt className="mr-2" /> 0929-429-0343
                  </li>
                  <li className="flex items-center">
                    <FaMapMarkerAlt className="mr-2" /> Davao City
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Copyright Section */}
          <div className="text-center mt-4 pt-4">
            <p>© 2022 Alofa, All Rights Reserved</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
