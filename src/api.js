import axios from 'axios';

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Axios instance for CSRF token retrieval
const csrfClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
  withCredentials: true, // This is important for cookies!
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "X-XSRF-TOKEN": getCookie('XSRF-TOKEN')
  }
});

// Axios instance for API requests
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true, // This is important for cookies!
  headers: {
    "X-Requested-With": "XMLHttpRequest",
    "X-XSRF-TOKEN": getCookie('XSRF-TOKEN')
  }
});

// Axios Interceptor (Automatically attach auth token & XSRF token)
// apiClient.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token'); // Get token from storage
//     const xsrf = getCookie('XSRF-TOKEN'); // Get xsrf-token from cookie

//     if (token) {
//       config.headers['Authorization'] = `Bearer ${token}`;
//     }
//     if (xsrf) {
//       config.headers['X-XSRF-TOKEN'] = xsrf; // Correct header name
//     }

//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// Handle Response Errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export { apiClient, csrfClient };