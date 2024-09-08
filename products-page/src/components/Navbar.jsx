// import { Link } from 'react-router-dom';

// const Navbar = () => {
//   const [isDropdownOpen, setIsDropdownOpen] = useState(false);

//   const handleDropdownToggle = () => {
//     setIsDropdownOpen(!isDropdownOpen);
//   };

//   return (
//     <nav className="navbar bg-gray-100 shadow-md">
//       <div className="container mx-auto px-4 py-3">
//         <div className="flex justify-between items-center">
//           <div className="flex space-x-4">
//             <Link to="/" className="text-pink-500 font-bold text-2xl">Alofa</Link>
//             <Link to="/" className="hover:text-pink-500">Home</Link>
//             <Link to="/products" className="hover:text-pink-500">Products</Link>
//             <Link to="/faqs" className="hover:text-pink-500">FAQs</Link>
//           </div>
//           <div className="flex space-x-2">
//             <button className="text-pink-500 hover:text-pink-700">Login</button>
//             <button className="text-pink-500 hover:text-pink-700">Sign Up</button>
//             <div className="relative">
//               <button className="text-pink-500 hover:text-pink-700" onClick={handleDropdownToggle}>
//                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-6 h-6">
//                   <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75l-2.25-2.25m0 0l-2.25-2.25m0 0l-2.25-2.25m6.75 6.75l-2.25-2.25m0 0l-2.25-2.25m0 0l-2.25-2.25" />
//                 </svg>
//               </button>
//               <div className={`absolute right-0 top-full ${isDropdownOpen ? 'block' : 'hidden'} bg-white rounded-lg shadow-md`}>
//                 <ul className="py-2">
//                   <li className="px-4 py-2 hover:bg-gray-200">Item 1</li>
//                   <li className="px-4 py-2 hover:bg-gray-200">Item 2</li>
//                   <li className="px-4 py-2 hover:bg-gray-200">Item 3</li>
//                 </ul>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;