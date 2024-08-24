import axios from './axios';

// PRODUCTS
export const getProducts = async () => {
    try {
        const response = await axios.get('/products');
        console.log('Products fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching products: ', error);
        throw error;
    }
};

export const createProduct = async (productData) => {
    try {
        const response = await axios.post('/products', productData);
        return response.data;
    } catch (error) {
        console.error('Error creating product: ', error);
        throw error;
    }
};

export const updateProduct = async (product) => {
    try {
        const response = await axios.put(`/products/${product.id}`, product);
        return response.data;
    } catch (error) {
        console.error('Error updating product: ', error);
        throw error;
    }
};

export const deleteProduct = async (productId) => {
    try {
        const response = await axios.delete(`/products/${productId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting product: ', error);
        throw error;
    }
};


// CATEGORIES
export const getCategories = async () => {
    try {
        const response = await axios.get('/product-category');
        console.log('Categories fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories: ', error);
        throw error;
    }
};


// INVENTORY
export const getInventory = async () => {
    try {
        const response = await axios.get('/inventory');
        console.log('Inventory fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching inventory: ', error);
        throw error;
    }
};

export const createInventory = async (inventoryData) => {
    try {
        const response = await axios.post('/inventory', inventoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating inventory: ', error);
        throw error;
    }
};

export const updateInventory = async (inventory) => {
    try {
        const response = await axios.put(`/inventory/${inventory.id}`, inventory);
        return response.data;
    } catch (error) {
        console.error('Error updating inventory: ', error);
        throw error;
    }
};

export const deleteInventory = async (inventoryId) => {
    try {
        const response = await axios.delete(`/inventory/${inventoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting inventory: ', error);
        throw error;
    }
};