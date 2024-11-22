import PropTypes from "prop-types";
import { useState, useContext } from "react";
import { CartContext } from "./CartContext.jsx";
import { useNavigate } from "react-router-dom";
import { getProductVariationById } from "../api/product.js";
import { MdAddShoppingCart } from "react-icons/md";
import { ClipLoader } from "react-spinners"; // Import the spinner component
import { toast } from 'sonner';

const ProductCard = ({ id, image, name, value, price, sku }) => {
  const { addToCart } = useContext(CartContext);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const navigate = useNavigate();

  // Mark the function as async to use await inside it
  const handleAddToCart = async (e) => {
    e.stopPropagation();

    try {
      // Fetch the latest product details by ID
      const variationData = await getProductVariationById(id);
      const latestProduct = variationData[0];

      // Check if stock quantity is greater than zero
      if (latestProduct.stock_quantity <= 0) {
        toast.error("This product cannot be added to the cart because it's out of stock.");
        return;
      }

      setIsAddingToCart(true);
      setTimeout(() => {
        addToCart({ id, image, name, value, price, sku });
        setIsAddingToCart(false);
        toast.success("Product added to cart successfully!");
      }, 500); // Adjust delay as necessary
    } catch (error) {
      console.error("Error fetching product details:", error);
      toast.error("Unable to add product to cart at this time.");
    }
  };

  const handleCardClick = () => {
    navigate(`/products/${id}`);
  };

  return (
    <div
      onClick={handleCardClick}
      className="relative p-1 rounded-lg cursor-pointer"
    >
      {/* inner card with white background */}
      <div className="bg-white border-2 border-alofa-light-pink rounded-lg shadow-md overflow-hidden flex flex-col justify-between w-56 text-center">
        {/* Square image occupying the whole top */}
        <div className="w-full aspect-square">
          <img
            src={image}
            alt={name}
            className="object-cover w-full h-full shadow-sm shadow-gray-400/50"
            style={{ maxWidth: "1024px", maxHeight: "1024px" }}
          />
        </div>
        {/* Product details */}
        <div className="flex flex-col items-start px-3 py-1">
          <h3
            className="mt-1 mb-1 text-lg font-semibold text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ maxWidth: "200px", height: "1.5rem" }} // Reduced margin-top
          >
            {name}
          </h3>
          <p
            className="mb-1 text-md font-light text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ lineHeight: "1.2", height: "1.2rem" }}// Reduced height
          >
            {value !== "N/A" ? value : ""}
          </p>

          <p className="text-xl font-bold text-gray-900 mt-1 mb-1">
            ₱
            {new Intl.NumberFormat("en-PH", {
              minimumFractionDigits: 2,
            }).format(price)}
          </p>
        </div>
        <div className="flex justify-end mt-1 mb-1 px-3 pb-2">
          <button
            className="font-extrabold text-white py-2 px-3 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F] disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleAddToCart}
            aria-label={`Add ${name} ${value} to cart`}
            disabled={isAddingToCart}
          >
            <div className="flex items-center justify-center w-full h-full">
              {isAddingToCart ? (
                <ClipLoader size={20} color='white' loading={isAddingToCart} />
              ) : (
                <MdAddShoppingCart size={20} />
              )}
            </div>
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
  sku: PropTypes.string,
  stock_quantity: PropTypes.number.isRequired,
};

export default ProductCard;
