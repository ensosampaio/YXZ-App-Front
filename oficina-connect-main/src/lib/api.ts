import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080',
});

let activeRequests = 0;

api.interceptors.request.use((config) => {
  activeRequests++;
  window.dispatchEvent(new Event('show-global-loading'));

  const token = localStorage.getItem('@YXZApp:token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    activeRequests--;
    if (activeRequests === 0) window.dispatchEvent(new Event('hide-global-loading'));
    return response;
  },
  (error) => {
    activeRequests--;
    if (activeRequests === 0) window.dispatchEvent(new Event('hide-global-loading'));
    if (error.response?.status === 401 || error.response?.status === 403) {
    console.error('Acesso negado ou token expirado.');
    window.dispatchEvent(new Event('unauthorized')); 
}
    return Promise.reject(error);
  }
);

export const extractErrorMessage = (error: unknown, defaultMessage = 'Ocorreu um erro inesperado.'): string => {
  if (axios.isAxiosError(error)) {
    if (!error.response) {
      return 'Erro de conexão. Verifique se o servidor está online.';
    }
    return error.response.data?.message || defaultMessage;
  }
  return defaultMessage;
};

export default api;