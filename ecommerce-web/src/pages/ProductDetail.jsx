// import { useParams } from 'react-router-dom';
// import { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';

// const ProductDetail = ({ productData }) => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(productData || null);

//   useEffect(() => {
//     if (!productData) {
//       // Fetch product by ID if productData is not provided
//       const fetchProduct = async () => {
//         const response = await fetch(`/api/products/${id}`);
//         const data = await response.json();
//         setProduct(data);
//       };

//       fetchProduct();
//     }
//   }, [id, productData]);

//   if (!product) return <div>Loading...</div>;

//   return (
//     <div className="product-detail-container flex p-8">
//       <div className="product-image w-1/2">
//         <img src={product.image} alt={product.name} className="w-full rounded-xl" />
//       </div>
//       <div className="product-info w-1/2 p-8">
//         <h1 className="text-4xl font-bold text-pink-500">{product.name}</h1>
//         <p className="text-lg mt-4">{product.description}</p>
//         <p className="text-xl font-bold mt-4">Price: ₱{product.price}</p>
//         <p className="text-sm text-gray-500 mt-2">In Stock: {product.stock}</p>
//         <button className="add-to-cart-btn mt-6 bg-pink-500 text-white py-2 px-6 rounded-lg font-semibold">
//           ADD TO CART
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ProductDetail;
