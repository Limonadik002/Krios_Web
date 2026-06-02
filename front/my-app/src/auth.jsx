export const getToken = () => localStorage.getItem("token");

export const isAuthenticated = () => !!getToken();

export const removeToken = () => {
  localStorage.removeItem("token");
};

// Добавлять токен в каждый запрос
export const authHeader = () => {
  const token = getToken();
  return token ? { "Authorization": `Bearer ${token}` } : {};
};