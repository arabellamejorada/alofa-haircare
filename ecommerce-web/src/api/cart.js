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
export const addItemToCart = async (variation_id, quantity) => {
    try {
        const response = await axios.post('/cart/add-item', { variation_id, quantity });
        console.log('Item added to cart: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error adding item to cart: ', error);
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
