import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const ProductDetails = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/api/products/${productId}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProduct();
  }, [productId]);

  if (!product) {
    return <div className="text-center mt-16">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-[url('../../public/images/body-bg.png')] bg-cover bg-center flex justify-center items-center">
      {/* Centered Content Container */}
      <div className="p-8 max-w-6xl w-full lg:w-3/4 flex flex-col lg:flex-row gap-12">
        {/* Product Image */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <img
            src={product.image} // Replace with the correct image field
            alt={product.name}
            className="rounded-lg object-cover h-[450px] w-full max-w-md shadow-lg"
          />
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 flex flex-col justify-between">
          <div>
            <h2 className="text-alofa-pink text-4xl font-bold font-title mb-4">{product.name}</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description || "Lorem ipsum dolor sit amet, consectetur adipiscing elit..."}
            </p>

            <div className="flex items-center justify-between text-gray-600 mb-6">
              <span className="font-semibold">Price: <span className="text-black text-xl font-bold">₱{product.price}</span></span>
              <span className="font-semibold">In Stock: <span className="text-black">{product.stock}</span></span>
            </div>
          </div>

          {/* Quantity Selector and Add to Cart Button */}
          <div className="flex items-center space-x-4 mt-6">
            <div className="flex items-center space-x-2 bg-gray-200 rounded-lg px-3 py-1">
              <button 
                onClick={() => setQuantity(quantity - 1)} 
                className="text-pink-500 font-bold" 
                disabled={quantity <= 1}
              >
                -
              </button>
              <span className="text-gray-700 font-semibold">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)} 
                className="text-pink-500 font-bold"
              >
                +
              </button>
            </div>

            <button className="font-extrabold text-white py-2 px-4 rounded-full focus:outline-none shadow-[0px_4px_4px_rgba(0,0,0,0.25)] bg-gradient-to-b from-[#FE699F] to-[#F8587A] hover:bg-gradient-to-b hover:from-[#F8587A] hover:to-[#FE699F] disabled:opacity-50 disabled:cursor-not-allowed">
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
