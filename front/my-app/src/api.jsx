const API_BASE_URL = "http://localhost:8080";

export const API_ROUTES = {
  getObjects: (page, limit) =>
    `${API_BASE_URL}/GetObjects?page=${page}&limit=${limit}`,

  searchObjects: (query) =>
    `${API_BASE_URL}/SearchObjects?query=${encodeURIComponent(query)}`,

  registerAdmin: () =>
    `${API_BASE_URL}/RegisterAdmin`,

  getProductByArt: (art) =>
    `${API_BASE_URL}/GetObject?art=${encodeURIComponent(art)}`,

  createProduct: () =>
    `${API_BASE_URL}/CreateObject`,
  
  updateProduct: (id) =>
    `${API_BASE_URL}/UpdateObject?id=${id}`,

  deleteProduct: (id) =>
    `${API_BASE_URL}/DeleteObject?id=${id}`,
};

export default API_BASE_URL;