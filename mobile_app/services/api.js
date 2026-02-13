import axios from 'axios';

const API_URL = process.env.EXPO_PUBLIC_API_URL;

if (!API_URL) {
  console.error("API_URL is missing! Check your .env file.");
}

const api = {
    getProducts: () => axios.get(`${API_URL}/products`),
    getCart: (sessionId) => axios.get(`${API_URL}/cart/${sessionId}`),
    addToCart: (sessionId, sku, qty) => axios.post(`${API_URL}/cart/${sessionId}/add?sku=${sku}&qty=${qty}`),
    checkout: (sessionId) => axios.post(`${API_URL}/orders/checkout/${sessionId}`),
    
    scanItem: (base64Image) => axios.post(`${API_URL}/scan`, { image: base64Image }),
};

export default api;