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

export const createFaq = async (faq) => {
    try {
        const response = await axios.post('/faqs', faq);
        return response.data;
    } catch (error) {
        console.error('Error creating FAQ:', error);
        return { error: 'Failed to create FAQ' };
    }
};

export const updateFaq = async (id, faq) => {
    try {
        const response = await axios.put(`/faqs/${id}`, faq);
        return response.data;
    } catch (error) {
        console.error('Error updating FAQ:', error);
        return { error: 'Failed to update FAQ' };
    }
};

export const deleteFaq = async (id) => {
    try {
        const response = await axios.delete(`/faqs/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting FAQ:', error);
        return { error: 'Failed to delete FAQ' };
    }
};
