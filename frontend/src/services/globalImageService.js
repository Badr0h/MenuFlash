import axiosInstance from '../api/axiosInstance';

const globalImageService = {
    getGenericImages: async () => {
        const response = await axiosInstance.get('/v1/images/generic');
        return response.data;
    }
};

export default globalImageService;
