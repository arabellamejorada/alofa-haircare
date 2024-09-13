// ProductCard.jsx
import PropTypes from 'prop-types';

const ProductCard = ({ image, name, price }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between p-4 w-56 m-4 text-center">
      <div className='w-full h-48'>
        <img src={image} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="mt-4 flex flex-col items-start">
        <h3 className="text-lg font-medium text-gray-700">{name}</h3>
        <p className="text-xl font-bold text-gray-900 mt-2">₱{price}</p>
      </div>
      <div className="flex justify-end mt-4">
        <button className="mt-4 bg-alofa-pink text-white py-2 px-4 rounded-full hover:bg-alofa-pink-gradient focus:outline-none shadow-m">
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

ProductCard.propTypes = {
  image: PropTypes.string.isRequired,  // image should be a string and is required
  name: PropTypes.string.isRequired,   // name should be a string and is required
  price: PropTypes.number.isRequired,  // price should be a number and is required
};

export default ProductCard;
