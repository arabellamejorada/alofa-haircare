import axios from './axios';

export const getAllFaqs = async () => {
    try {
        const response = await axios.get('/faqs');
        return response.data;
    } catch (error) {
        console.error('Error fetching FAQs:', error);
        return { error: 'Failed to fetch FAQs' };
    }
};

export const getFaqById = async (id) => {
    try {
        const response = await axios.get(`/faqs/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching FAQ:', error);
        return { error: 'Failed to fetch FAQ' };
    }
};

