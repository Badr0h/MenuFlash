import axiosInstance from '../api/axiosInstance';

const categoryService = {
    getAllCategories: async () => {
        const response = await axiosInstance.get('/v1/categories');
        return response.data;
    },
    createCategory: async (categoryData) => {
        const response = await axiosInstance.post('/v1/categories', categoryData);
        return response.data;
    },
    deleteCategory: async (id) => {
        await axiosInstance.delete(`/v1/categories/${id}`);
    }
};

export default categoryService;
