import axios from './axios';

// Get all product variations
export const getAllProductVariations = async () => {
    try {
        const response = await axios.get('/product-variations');
        console.log('Product variations fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching product variations: ', error);
        throw error;
    }
};

// Get product variation by ID
export const getProductVariationById = async (id) => {
    try {
        const response = await axios.get(`/product-variations/${id}`);
        console.log('Product variation fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching product variation: ', error);
        throw error;
    }
};


// Get all products
export const getAllProducts = async () => {
    try {
        const response = await axios.get('/products');
        console.log('Products fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching products: ', error);
        throw error;
    }
};

// Get product by ID
export const getProductById = async (id) => {
    try {
        const response = await axios.get(`/products/${id}`);
        console.log('Product fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching product: ', error);
        throw error;
    }
};

// get all categories
export const getAllCategories = async () => {
    try {
        const response = await axios.get('/product-category');
        console.log('Categories fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories: ', error);
        throw error;
    }
};