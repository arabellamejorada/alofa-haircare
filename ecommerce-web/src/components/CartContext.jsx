import PropTypes from 'prop-types';
import { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

const CartProvider = ({ children }) => {
  // Initialize cart from localStorage or empty array
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('cartItems');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
  }, [cartItems]);

  // Function to add item to cart
  const addToCart = (product) => {
    // Check if the item is already in the cart
    const existingItem = cartItems.find(item => item.id === product.id);

    if (existingItem) {
      // Update the quantity
      setCartItems(cartItems.map(item =>
        item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      // Add new item to cart
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  // Function to handle quantity change
  const handleQuantityChange = (productId, quantity) => {
    setCartItems(cartItems.map(item =>
      item.id === productId ? { ...item, quantity } : item
    ));
  };

  // Function to remove item from cart
  const handleDelete = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      handleQuantityChange,
      handleDelete,
    }}>
      {children}
    </CartContext.Provider>
  );
};

// Add prop types validation for 'children'
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export { CartProvider };
