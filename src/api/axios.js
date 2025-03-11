import axios from "axios";
import { getCsrfToken } from "@/utils/csrfToken";
import { useAuthStore } from "@/stores/auth";

const apiClient = axios.create({
  baseURL: `${import.meta.env.VITE_BACKEND_BASE_URL}`,
  headers: {
    "Content-Type": "application/json"
  },
  withCredentials: true,
});

// Request interceptor to update CSRF token before each request
apiClient.interceptors.request.use((config) => {
  const authStore = useAuthStore();

  // Refresh CSRF token before each request
  config.headers["X-XSRF-TOKEN"] = decodeURIComponent(getCsrfToken());

  // Add Authorization token if available
  if (authStore.token) {
    config.headers.Authorization = `Bearer ${authStore.token}`;
  }

  return config;
});

export default apiClient;