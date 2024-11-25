import axios from './axios';

export const createProductWithVariationAndInventory = async (formData) => {
  try {
    // Send the request
    const response = await axios.post('/products', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    // console.log('Product with variations and inventory created: ', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating product with variations and inventory: ', error);
    throw error;
  }
};


// export const createProductVariationWithInventory = async (productData) => {
//     try {
//         const response = await axios.post('/product-variations', productData, {
//             headers: {
//                 "Content-Type": "multipart/form-data",
//             },
//             });        
//             console.log('Product variation with inventory created: ', response.data);
//         return response.data;
//     } catch (error) {
//         console.error('Error creating product variation with inventory: ', error);
//         throw error;
//     }
// };

// export const createProduct = async (productData) => {
//     try {
//         const response = await axios.post('/products', productData);
//         return response.data;
//     } catch (error) {
//         console.error('Error creating product: ', error);
//         throw error;
//     }
// };

export const getAllProducts = async () => {
    try {
        const response = await axios.get('/products');
        const data = response.data; // Directly access the data from the response
        // console.log('Products fetched: ', data);
        return data.map(product => ({
            ...product,
            is_archived: product.is_archived || false, // Default to false if not present
        }));
    } catch (error) {
        console.error('Error fetching products: ', error);
        throw error;
    }
};
export const updateProduct = async (productId, productData) => {
    try {
        const response = await axios.put(`/products/${productId}`, productData);
        return response.data;
    } catch (error) {
        console.error('Error updating product: ', error);
        throw error;
    }
};


export const archiveProduct = async (productId) => {
    try {
        const response = await axios.put(`/products/${productId}/archive`);
        return response.data;
    } catch (error) {
        console.error('Error archiving product: ', error);
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
        // console.log('Categories fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching categories: ', error);
        throw error;
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await axios.post('/product-category', categoryData);
        return response.data;
    } catch (error) {
        console.error('Error creating category: ', error);
        throw error;
    }
};

export const updateCategory = async (categoryId, categoryData) => {
    try {
        const response = await axios.put(`/product-category/${categoryId}`, categoryData);
        return response.data;
    } catch (error) {
        console.error('Error updating category: ', error);
        throw error;
    }
};

export const deleteCategory = async (categoryId) => {
    try { 
        const response = await axios.delete(`/product-category/${categoryId}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting category: ', error);
        throw error;
    }
};


// PRODUCT STATUS
export const getStatus = async () => {
    try {
        const response = await axios.get('/product-status');
        // console.log('Product statuses fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching product statuses: ', error);
        throw error;
    }
};

// INVENTORY
export const getInventory = async () => {
    try {
        const response = await axios.get('/inventory');
        // console.log('Inventory fetched: ', response.data);
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

// GET PRODUCT VARIATIONS
export const getAllProductVariations = async () => {
    try {
        const response = await axios.get('/product-variations');
        // console.log('Product variations fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching product variations: ', error);
        throw error;
    }
};

// Update product variation with image
export const updateProductVariation = async (variationId, variationData) => {
    try {
        const response = await axios.put(`/product-variations/${variationId}`, variationData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error updating product variation with image: ', error);
        throw error;
    }
};


export const archiveProductVariation = async (variationId) => {
    try {
        const response = await axios.put(`/product-variations/${variationId}/archive`);
        return response.data;
    } catch (error) {
        console.error('Error archiving product variation: ', error);
        throw error;
    }
};