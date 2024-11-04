import axios from './axios';

export const createOrder = async (orderData, cartItems) => {
    try {
        //find voucher_id of the voucherCode applied
        let voucher_id = null;
        if (orderData.voucherCode) {
            const response = await axios.get(`/voucher/code/${orderData.voucherCode}`);
            if (response.data.voucher) {
                voucher_id = response.data.voucher.voucher_id;
            }
        }

        // add voucher_id to orderData
        orderData.voucher_id = voucher_id;
        
        // create order passing orderData and cartItems
        const response = await axios.post('/order', { orderData, cartItems });
        console.log('Order created:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error creating order:', error);
        return null;
    }
};
