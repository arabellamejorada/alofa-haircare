import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { CartContext } from "./CartContext.jsx";
import { toast } from "sonner";
import { ClipLoader } from "react-spinners"; // Import the spinner component

const ProductCard = ({ id, image, name, value, price, sku }) => {
  const { addToCart } = useContext(CartContext);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = () => {
    setIsAddingToCart(true);
    // Simulate a delay to show loading effect (you can remove this if unnecessary)
    setTimeout(() => {
      addToCart({ id, image, name, value, price });
      toast.success(`${name} ${value} added to cart!`);
      setIsAddingToCart(false);
    }, 500); // Add a delay to simulate server response, if needed
  };

  return (
    <div className="relative p-2 rounded-lg">
      {/* Inner card with white background */}
      <div className="bg-white border-4 border-alofa-light-pink rounded-lg shadow-md overflow-hidden flex flex-col justify-between w-56 text-center">
        {/* Square image occupying the whole top */}
        <div className="w-full aspect-square">
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full"
            style={{ maxWidth: "1024px", maxHeight: "1024px" }}
          />
        </div>
        <div className="mt-4 flex flex-col items-start px-4">
          <h3 className="text-lg font-medium text-gray-700 h-10 overflow-hidden text-ellipsis whitespace-nowrap">
            {name}
          </h3>
          <p className="text-md font-medium text-gray-700 h-10 overflow-hidden text-ellipsis whitespace-nowrap">
            {value}
          </p>
          <p className="text-xl font-bold text-gray-900 mt-2">₱{price}</p>
        </div>
        <div className="flex justify-end mt-4 px-4 pb-3">
          <button
            className="font-extrabold text-white py-2 px-4 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            aria-label={`Add ${name} ${value} to cart`}
            disabled={isAddingToCart} // Disable button while adding to cart
          >
            {isAddingToCart ? (
              <ClipLoader size={20} color="#FFFFFF" loading={isAddingToCart} />
            ) : (
              "ADD TO CART"
            )}
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
  value: PropTypes.string,
  price: PropTypes.number.isRequired,
};

export default ProductCard;
