import axios from 'axios';

const API_URL = 'http://localhost:8080/api/v1';

const api = {

    getProducts: () => axios.get(`${API_URL}/products`),
    createProduct: (product) => axios.post(`${API_URL}/products`, product),
    deleteProduct: (sku) => axios.delete(`${API_URL}/products/${sku}`),

    getInventory: () => axios.get(`${API_URL}/inventory`),
    addStock: (stockData) => axios.post(`${API_URL}/inventory/stock`, stockData),


    scanItem: (base64Image) => axios.post(`${API_URL}/scan`, { image: base64Image }),
};

export default api;