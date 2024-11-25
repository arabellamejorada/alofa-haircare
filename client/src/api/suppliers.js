import axios from './axios';

export const getAllSuppliers = async () => {
    try {
        const response = await axios.get('/suppliers');
        // console.log('Suppliers fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching suppliers: ', error);
        throw error;
    }
};

export const getSupplier = async (id) => {
    try {
        const response = await axios.get(`/suppliers/${id}`);
        // console.log('Supplier fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching supplier: ', error);
        throw error;
    }
};

export const createSupplier = async (supplierData) => {
    try {
        const response = await axios.post('/suppliers', supplierData);
        // console.log('Supplier created: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating supplier: ', error);
        throw error;
    }
};

export const updateSupplier = async (id, supplierData) => {
    try {
        const response = await axios.put(`/suppliers/${id}`, supplierData);
        // console.log('Supplier updated: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating supplier: ', error);
        throw error;
    }
};

export const archiveSupplier = async (id) => {
    try {
        const response = await axios.put(`/suppliers/${id}/archive`);
        // console.log('Supplier archived: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error archiving supplier: ', error);
        throw error;
    }
};



