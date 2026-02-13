import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const api = {

    getProducts: () => axios.get(`${API_URL}/products`),
    getInventory: () => axios.get(`${API_URL}/inventory`),
    
    getCart: (sessionId) => axios.get(`${API_URL}/cart/${sessionId}`),
    addToCart: (sessionId, sku, qty) => axios.post(`${API_URL}/cart/${sessionId}/add?sku=${sku}&qty=${qty}`),
    clearCart: (sessionId) => axios.delete(`${API_URL}/cart/${sessionId}`),

    checkout: (sessionId) => axios.post(`${API_URL}/orders/checkout/${sessionId}`),
    
    addStock: (data) => axios.post(`${API_URL}/inventory/stock`, data),

    scanItem: (base64Image) => axios.post(`${API_URL}/scan`, { image: base64Image }),
};

export default api;