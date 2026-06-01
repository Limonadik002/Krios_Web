const API_BASE_URL = 'http://localhost:8080';

export const API_ROUTES = {
  getObjects: (page, limit) => `${API_BASE_URL}/GetObjects?page=${page}&limit=${limit}`,
  searchObjects: (query) => `${API_BASE_URL}/SearchObjects?query=${encodeURIComponent(query)}`,
  getAllCategories: () => `${API_BASE_URL}/GetAllCategories`,
  getPopularCategories: () => `${API_BASE_URL}/GetPopularCategories`,
  getObjectsByCategory: (category) => `${API_BASE_URL}/GetObjectsByCategory?category=${encodeURIComponent(category)}`,
  registerAdmin: () => `${API_BASE_URL}/RegisterAdmin`,
};

export default API_BASE_URL;