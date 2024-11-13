import { FaFacebookF, FaInstagram, FaTiktok, FaPhoneAlt, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-t from-pink-500 to-pink-300 text-white pt-8 pb-4">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-center">
          {/* Logo Section */}
          <div className="mb-6 lg:mb-0">
            <h1 className="text-4xl font-title">Alofa</h1>
          </div>

          {/* Follow Us Section */}
          <div className="flex flex-col items-center lg:items-start mb-6 lg:mb-0">
            <h2 className="text-lg font-semibold mb-2">Follow Us:</h2>
            <ul>
              <li className="flex items-center mb-1">
                <FaFacebookF className="mr-2" /> Facebook
              </li>
              <li className="flex items-center mb-1">
                <FaInstagram className="mr-2" /> Instagram
              </li>
              <li className="flex items-center">
                <FaTiktok className="mr-2" /> Tiktok
              </li>
            </ul>
          </div>

          {/* Contact Us Section */}
          <div className="flex flex-col items-center lg:items-start">
            <h2 className="text-lg font-semibold mb-2">Contact Us:</h2>
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

        {/* Copyright Section */}
        <div className="text-center mt-8 border-t border-white pt-4">
          <p>© 2024 Alofa, All Rights Reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
