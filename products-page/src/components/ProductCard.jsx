// import PropTypes from 'prop-types';

// const ProductCard = ({ image, title, price }) => {
//     return (
//       <div className="bg-white shadow-lg rounded-lg p-4">
//         {/* Product Image */}
//         <div className="flex justify-center">
//           <img src={image} alt={title} className="rounded-lg h-40 w-40 object-cover" />
//         </div>
  
//         {/* Product Details */}
//         <div className="mt-4 text-center">
//           <h3 className="text-xl font-semibold">{title}</h3>
//           <p className="text-xl font-bold text-black mt-2">₱{price}</p>
//         </div>
  
//         {/* Add to Cart Button */}
//         <div className="mt-4 text-center">
//           <button className="bg-pink-500 text-white font-bold py-2 px-4 rounded-full shadow hover:bg-pink-600 transition duration-300">
//             ADD TO CART
//           </button>
//         </div>
//       </div>
//     );
//   };
  
//   // Adding prop validation using PropTypes
//   ProductCard.propTypes = {
//     image: PropTypes.string.isRequired,  // The image prop must be a string
//     title: PropTypes.string.isRequired,  // The title prop must be a string
//     price: PropTypes.number.isRequired,  // The price prop must be a number
//   };
  
//   export default ProductCard;

const ProductCard = () => {
  return (
    <div className="container-product-card">
        <div className="product-card">
            <div className="top-card">
                 {/* img, price */}
                 <img src="" className="product-img"></img>


            </div>
            <div className="bottom-card">
                {/* name, desc, cta */}

            </div>
        </div>
    </div>
  )
}

export default ProductCard
