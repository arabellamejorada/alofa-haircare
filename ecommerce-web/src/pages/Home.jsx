

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section bg-[url('../../public/images/hero-bg.png')] bg-cover bg-center h-screen flex flex-col justify-center items-center  relative overflow-hidden">
        <h1 className="text-7xl font-title font-bold text-white text-center">Simple and Clean Haircare</h1>
        <button className="mt-8 font-bold focus:outline-none bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F] text-white py-3 px-6 rounded-full text-lg shadow-lg">
          View Products
        </button>
      </section>

      {/* About Us Section */}
      <section className="about-us-section bg-[url('../../public/images/about-us-bg.png')] bg-cover bg-center h-screen flex flex-col justify-center items-center bg-white">
        <div className="text-center max-w-3xl px-4">
          <h2 className="text-6xl font-title font-bold text-alofa-pink mb-4">About Us</h2>
          <p className="text-gray-700 text-lg leading-relaxed">
            Alofa Haircare is an all-natural haircare brand based and made locally in the Philippines. They started with one product: <b className="gradient-heading">Alofa&apos;s All Natural Hair Oil,</b> which aims to heal hair back to health and promote hair growth with natural ingredients.
            Their main ingredient is Rosemary oil, which is known to stimulate the scalp and promote hair growth. Along with 7 other natural oils, they would like to create the image of self-care through haircare. Additionally, they have other hair products,
            including hair clips and hair brushes.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Home;
