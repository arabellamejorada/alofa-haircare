import PropTypes from "prop-types";
import { useContext } from "react";
import { CartContext } from "./CartContext.jsx";

const ProductCard = ({ id, image, name, price }) => {
  const { addToCart } = useContext(CartContext);

  const handleAddToCart = () => {
    addToCart({ id, image, name, price });
    alert(`${name} added to cart!`);
  };

  return (
    <div className="relative p-2 rounded-lg">
      {/* Inner card with white background */}
      <div className="bg-white border-4 border-alofa-light-pink rounded-lg shadow-md overflow-hidden flex flex-col justify-between w-56 text-center">
        {/* Square image occupying the whole top */}
        <div className="w-full aspect-square">
          <img src={image} alt={name} className="object-cover w-full h-full" style={{ maxWidth: "1024px", maxHeight: "1024px" }}/>
        </div>
        <div className="mt-4 flex flex-col items-start px-4">
          <h3 className="text-lg font-medium text-gray-700">{name}</h3>
          <p className="text-xl font-bold text-gray-900 mt-2">₱{price}</p>
        </div>
        <div className="flex justify-end mt-4 px-4 pb-3">
          <button
            className="font-extrabold text-white py-2 px-4 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F]"
            onClick={handleAddToCart}
            aria-label={`Add ${name} to cart`}
          >
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  price: PropTypes.number.isRequired,
};

export default ProductCard;
