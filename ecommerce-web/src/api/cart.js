import axios from './axios';

// CREATE CART
export const createCart = async (customer_id) => {
    try {
        const response = await axios.post('/cart', { customer_id });
        console.log('Cart created: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating cart: ', error.message
        );
        throw error;
    }
};

// ADD ITEM TO CART
export const addCartItem = async (cart_id, variation_id, quantity) => {
    try {
        const response = await axios.post(`/cart/${cart_id}/add`, { variation_id, quantity });
        console.log('Item added to cart: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding item to cart: ', error.message);
        throw error;
    }
};

// UPDATE ITEM IN CART
export const updateCartItem = async (cart_id, variation_id, quantity) => {
    try {
        const response = await axios.put(`/cart/${cart_id}/update`, { variation_id, quantity });
        console.log('Item updated in cart: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating item in cart: ', error.message);
        throw error;
    }
};

// DELETE ITEM FROM CART
export const deleteCartItem = async (cart_id, variation_id) => {
    try {
        const response = await axios.delete(`/cart/${cart_id}/item/${variation_id}`);
        console.log('Item deleted from cart: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting item from cart: ', error.message);
    }
};

// VIEW CART
export const getCartById = async (cart_id) => {
  try {
    const response = await axios.get(`/cart/${cart_id}`);

    // Extract data from response
    const { cart, items } = response.data;

    // Construct full image URLs for cart items
    const updatedItems = items.map((item) => {
      const imageName = item.image ? item.image.split("/").pop() : null;
      return {
        ...item,
        image: imageName
          ? `http://localhost:3001/uploads/${imageName}` // Construct the full image URL
          : "https://via.placeholder.com/150?text=No+Image+Available", // Use a placeholder if no image
      };
    });

    // Return the updated cart data with updated items
    const updatedCartData = {
      cart,
      items: updatedItems,
    };

    console.log("Cart Fetched: ", updatedCartData);
    return updatedCartData;
  } catch (error) {
    console.error("Error retrieving cart: ", error.message);
    throw error;
  }
};


export const getCartByCustomerId = async (profile_id) => {
  console.log("Customer ID received: ", profile_id);
  try {
    const response = await axios.get(`/cart/customer/${profile_id}`);

    // Extract data from response
    const { cart, items } = response.data;

    // Construct full image URLs for cart items
    const updatedItems = items.map((item) => {
      const imageName = item.image ? item.image.split("/").pop() : null;
      return {
        ...item,
        image: imageName
          ? `http://localhost:3001/uploads/${imageName}` // Construct the full image URL
          : "https://via.placeholder.com/150?text=No+Image+Available", // Use a placeholder if no image
      };
    });

    // Return the updated cart data with updated items
    const updatedCartData = {
      cart,
      items: updatedItems,
    };

    console.log("Updated Cart Data: ", updatedCartData);
    return updatedCartData;
  } catch (error) {
    console.error("Error retrieving cart: ", error.message);
    throw error;
  }
};


export const mergeCarts = async (guest_cart_id, profile_id) => {
    try {
        const response = await axios.post(`/cart/merge`, { guest_cart_id, profile_id });
        console.log('Carts merged: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error merging carts: ', error.message);
        throw error;
    }
} 

export const applyVoucher = async (code, subtotal, customer_id) => {
    try {
        console.log("Voucher code received: ", code, subtotal, customer_id);
        const response = await axios.post('/voucher/apply', { code, subtotal, customer_id });
        return response.data;
    } catch (error) {
        console.error('Error applying voucher: ', error.message);
        throw error;
    }
};