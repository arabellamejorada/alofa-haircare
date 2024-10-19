import axios from './axios';

// CREATE CART
export const createOrGetCart = async (customer_id) => {
    try {
        const response = await axios.post('/cart', { customer_id });
        console.log('Cart created: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating cart: ', error);
        throw error;
    }
};

// ADD ITEM TO CART
export const addCartItem = async (variation_id, quantity) => {
    try {
        const response = await axios.post('/cart/add-item', { variation_id, quantity });
        console.log('Item added to cart: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding item to cart: ', error);
        throw error;
    }
};

// UPDATE ITEM IN CART
export const updateCartItem = async (cart_item_id, quantity) => {
    try {
        const response = await axios.put(`/cart/update-item/${cart_item_id}`, { quantity });
        console.log('Item updated in cart: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating item in cart: ', error);
        throw error;
    }
};

// DELETE ITEM FROM CART
export const deleteCartItem = async (cart_item_id) => {
    try {
        const response = await axios.delete(`/cart/delete-item/${cart_item_id}`);
        console.log('Item deleted from cart: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting item from cart: ', error);
        throw error;
    }
};

// VIEW CART
export const viewCartItemsById = async (cart_id) => {
    try {
        const response = await axios.get(`/cart/items/${cart_id}`);
        console.log('Cart fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching cart: ', error);
        throw error;
    }
};
