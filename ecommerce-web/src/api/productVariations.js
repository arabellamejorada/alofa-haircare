import axios from './axios';

// GET PRODUCT VARIATIONS
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

// GET PRODUCT VARIATION BY ID
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


