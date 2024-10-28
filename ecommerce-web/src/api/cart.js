import axios from './axios';

// CREATE CART
export const createOrGetCart = async (customer_id) => {
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
        const response = await axios.post(`/cart/${cart_id}/add-item`, { variation_id, quantity });
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
        const response = await axios.put(`/cart/${cart_id}/update-item`, { variation_id, quantity });
        console.log('Item updated in cart: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating item in cart: ', error.message);
        throw error;
    }
};

// DELETE ITEM FROM CART
export const deleteCartItem = async (cart_id, cart_item_id) => {
    try {
        const response = await axios.delete(`/cart/${cart_id}/item/${cart_item_id}`);
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
        console.log('Cart retrieved: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error retrieving cart: ', error.message);
        throw error;
    }
};

export const mergeCarts = async (guest_cart_id, customer_id) => {
    try {
        const response = await axios.post(`/cart/merge`, { guest_cart_id, customer_id });
        console.log('Carts merged: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error merging carts: ', error.message);
        throw error;
    }
}