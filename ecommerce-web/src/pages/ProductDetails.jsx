import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import { CartContext } from "../components/CartContext";
import { getProductById, getProductVariationById } from "../api/product.js";
import { ClipLoader } from "react-spinners";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [variation, setVariation] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useContext(CartContext);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProductAndVariation = async () => {
      try {
        // Fetch product by ID
        const productData = await getProductById(productId);
        setProduct(productData);

        // If the product has a variation_id, fetch the variation details
        if (productData.variation_id) {
          const variationData = await getProductVariationById(productData.variation_id);
          setVariation(variationData);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductAndVariation();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product.variation_id) {
      console.error("Variation ID is missing.");
      return;
    }

    setIsAddingToCart(true); // Start loading
    setTimeout(() => {
      addToCart({
        id: product.id,
        image: product.image,
        name: product.name,
        price: product.price,
        variation: variation ? variation.name : "Default", // Ensure variation value is passed
        variation_id: product.variation_id, // Use variation_id for the cart item
        quantity,
      });
      setIsAddingToCart(false); // Stop loading
    }, 500); // Adjust delay as necessary
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    } else if (e.target.value === "") {
      setQuantity("");
    }
  };

  return (
    <div className="min-h-screen bg-[url('../../public/images/body-bg.png')] bg-cover bg-center flex justify-center items-center">
      {/* Centered Content Container */}
      <div className="p-16 max-w-7xl w-full lg:w-4/5 flex flex-col lg:flex-row gap-16">

        {/* Render Product Image and Details only if product is not null */}
        {product ? (
          <>
            {/* Product Image */}
            <div className="w-full lg:w-1/2 flex justify-center items-center">
              <img
                src={product.image}
                alt={product.name}
                className="rounded-3xl object-cover h-[550px] w-[450px] shadow-xl border-4 border-white"
              />
            </div>

            {/* Product Details Section */}
            <div className="w-full lg:w-1/2 flex flex-col justify-between relative p-0">
              {/* White Container with Product Details */}
              <div className="bg-white shadow-lg p-12 rounded-3xl h-[450px] flex flex-col">
                <h2 className="gradient-heading text-5xl font-bold font-title mb-2">{product.name}</h2>
                <p className="text-gray-600 italic text-lg mb-6">
                  {variation ? variation.value : ""}
                </p>
                <p className="text-gray-600 mb-8 leading-relaxed text-lg flex-grow">
                  {product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."}
                </p>

                {/* Fixed position for In Stock and Price */}
                <div className="mt-auto flex items-center justify-between text-gray-600 text-lg">
                  <span className="font-semibold">
                    In Stock: <span className="text-black">{product.stock}</span>
                  </span>
                  <span className="font-semibold">
                    Price: <span className="text-black text-2xl font-bold">₱{product.price}</span>
                  </span>
                </div>
              </div>

              {/* Quantity Selector and Add to Cart Button */}
              <div className="flex items-center space-x-6 mt-1 justify-end">
                <div className="flex items-center bg-white rounded-lg px-2 py-2 shadow-md">
                  <button
                    onClick={() => setQuantity(Math.max(quantity - 1, 1))}
                    className="text-alofa-pink bg-gray-200 hover:bg-gray-300 font-bold text-2xl px-3 py-1 rounded-md"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="text-gray-700 font-semibold text-2xl w-16 text-center border-none outline-none bg-white mx-3"
                    min="1"
                  />
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-alofa-pink bg-gray-200 hover:bg-gray-300 font-bold text-2xl px-3 py-1 rounded-md"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="font-extrabold text-white text-lg py-3 px-6 rounded-full 
                  focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b 
                  from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] 
                  hover:to-[#FE699F] disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isAddingToCart} // Disable button during loading
                >
                  {isAddingToCart ? (
                    <ClipLoader size={20} color="#FFFFFF" loading={isAddingToCart} />
                  ) : (
                    "ADD TO CART"
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          // Loading state
          <div className="flex justify-center items-center w-full h-[450px]">
            <ClipLoader size={50} color="#F8587A" loading={true} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
