import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section bg-[url('../../public/images/hero-bg.png')] bg-cover bg-center h-screen flex flex-col justify-center items-start pl-10 relative overflow-hidden">
        <div className="px-40">
          <motion.h1
            className="text-9xl font-body font-extrabold text-[#FFFFFF] text-left"
            style={{ textShadow: '1px 1px 2px rgba(0, 0, 0, 0.3)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          >
            Simple and Clean Haircare
          </motion.h1>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5, ease: 'easeInOut' }}
          >
            <Link to="/products">
              <button className="relative mt-8 font-bold focus:outline-none bg-gradient-to-b from-[#FE699F] to-[#F8587A] text-white py-5 px-10 rounded-full text-2xl shadow-lg overflow-hidden transition-transform duration-300 transform hover:scale-110">
                Shop Now
                {/* Soft Shine Overlay */}
                <span className="absolute inset-0 rounded-full bg-gradient-radial from-white/30 to-transparent opacity-50 transform -translate-x-1 -translate-y-1 scale-125"></span>
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* About Us Section */}
      <section className="about-us-section bg-[#FFFAF0] h-screen flex flex-col justify-center items-center">
        <div className="text-center max-w-3xl px-4">
          <h2 className="text-8xl font-title font-bold gradient-heading mb-4">About Us</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Alofa Haircare is an all-natural haircare brand based and made locally in the Philippines. They started with one product: <b className="gradient-heading">All Natural Hair Oil,</b> which aims to heal hair back to health and promote hair growth with natural ingredients.
            Their main ingredient is Rosemary oil, which is known to stimulate the scalp and promote hair growth. Along with 7 other natural oils, they would like to create the image of self-care through haircare. Additionally, they have other hair products,
            including hair clips and hair brushes.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
