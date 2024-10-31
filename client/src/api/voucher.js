import axios from './axios';

export const getAllVouchers = async () => {
    try {
        const response = await axios.get('/voucher/all');
        console.log('Vouchers fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching vouchers: ', error);
        throw error;
    }
};

export const getVoucherById = async (id) => {
    try {
        const response = await axios.get(`/voucher/${id}`);
        console.log('Voucher fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching voucher: ', error);
        throw error;
    }
};

export const createVoucher = async (voucherData) => {
    try {
        const response = await axios.post('/voucher', voucherData);
        console.log('Voucher created: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating voucher: ', error);
        throw error;
    }
};

export const updateVoucher = async (id, voucherData) => {
    try {
        const response = await axios.put(`/voucher/${id}`, voucherData);
        console.log('Voucher updated: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating voucher: ', error);
        throw error;
    }
};

export const deleteVoucher = async (id) => {
    try {
        const response = await axios.delete(`/voucher/${id}`);
        console.log('Voucher deleted: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting voucher: ', error);
        throw error;
    }
};

