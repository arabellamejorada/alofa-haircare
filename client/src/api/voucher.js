import axios from './axios';

export const getAllVouchers = async () => {
    try {
        const response = await axios.get('/voucher/all');
        return response.data;
    } catch (error) {
        console.error('Error fetching vouchers: ', error);
        throw error;
    }
};

export const getVoucherById = async (id) => {
    try {
        const response = await axios.get(`/voucher/${id}`);
        // console.log('Voucher fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching voucher: ', error);
        throw error;
    }
};

export const getVoucherProductVariations = async (voucher_id) => {
    try {
        const response = await axios.get(`/voucher/variations/${voucher_id}`);
        // console.log('Voucher variations fetched: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error fetching voucher variations: ', error);
        throw error;
    }
};

export const createVoucher = async (voucherData) => {
    try {
        const response = await axios.post('/voucher', voucherData);
        // console.log('Voucher created: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating voucher: ', error);
        throw error;
    }
};

export const updateVoucher = async (id, voucherData) => {
    try {
        const response = await axios.put(`/voucher/${id}`, voucherData);
        // console.log('Voucher updated: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error updating voucher: ', error);
        throw error;
    }
};

export const deleteVoucher = async (id) => {
    try {
        const response = await axios.delete(`/voucher/${id}`);
        // console.log('Voucher deleted: ', response.data);
        return response.data;
    } catch (error) {
        console.error('Error deleting voucher: ', error);
        throw error;
    }
};

export const manageVoucherVariations = async (voucherId, variations) => {
  try {
    const response = await axios.post('/voucher/manage-variations', {
      voucher_id: voucherId,
      variations: variations, // an array of variation IDs
    });
    return response.data; // Return the response message
  } catch (error) {
    console.error('Error managing voucher variations:', error);
    throw error; // Propagate the error to handle it in the calling function
  }
};

export const getAllUsedVouchers = async () => {
    try {
        const response = await axios.get('/voucher/all/used');
        return response.data;
    } catch (error) {
        console.error('Error fetching used vouchers: ', error);
        throw error;
    }
};  