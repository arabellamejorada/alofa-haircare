import { FaFacebookF, FaInstagram, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <div className="relative">
      {/* Footer Section */}
      <footer className="bg-alofa-pink border-0 border-t-slate-300 text-black py-4 shadow-xl">
        <div className="container mx-auto flex flex-col lg:flex-row justify-between items-center">
          {/* Logo Section */}
          <div className="flex flex-col items-start mb-4 lg:mb-0">
            <h1 className="text-4xl font-title text-white"
            style={{ textShadow: '1px 1px 1px rgba(0, 0, 0, 0.3)' }}
            >
              alofa haircare
            </h1>
            <p className="text-sm text-slate-100">natural & clean haircare</p>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4 text-white">
            <a href="https://www.facebook.com/profile.php?id=100083016888414" target="_blank" rel="noopener noreferrer">
              <FaFacebookF className="text-2xl hover:text-slate-200" />
            </a>
            <a href="https://www.instagram.com/alofahaircare/" target="_blank" rel="noopener noreferrer">
              <FaInstagram className="text-2xl hover:text-slate-200" />
            </a>
            <a href="https://www.tiktok.com/@alofahaircare" target="_blank" rel="noopener noreferrer">
              <FaTiktok className="text-2xl hover:text-slate-200" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
