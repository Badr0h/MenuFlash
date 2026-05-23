import axiosInstance from '../api/axiosInstance';

const productService = {
    getAllProducts: async () => {
        const response = await axiosInstance.get('/v1/products');
        return response.data;
    },

    getProductById: async (id) => {
        const response = await axiosInstance.get(`/v1/products/${id}`);
        return response.data;
    },

    createProduct: async (productData) => {
        const response = await axiosInstance.post('/v1/products', productData);
        return response.data;
    },

    updateProduct: async (id, productData) => {
        const response = await axiosInstance.put(`/v1/products/${id}`, productData);
        return response.data;
    },

    deleteProduct: async (id) => {
        await axiosInstance.delete(`/v1/products/${id}`);
    },

    updateAvailability: async (id, isAvailable) => {
        const response = await axiosInstance.patch(`/v1/products/${id}/availability`, { isAvailable });
        return response.data;
    },

    filterProducts: async (category, isAvailable = true) => {
        const response = await axiosInstance.get('/v1/products/filter', {
            params: { category, isAvailable }
        });
        return response.data;
    }
};

export default productService;
