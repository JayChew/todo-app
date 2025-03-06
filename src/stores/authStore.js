import { defineStore } from "pinia";
import { apiClient, csrfClient } from "../api";
sessionStorage
export const useAuthStore = defineStore("auth", {
  state: () => ({ user: null, token: sessionStorage.getItem("token") || "" }),
  actions: {
    async login(email, password) {
      await csrfClient.get('/sanctum/csrf-cookie');
      const response = await apiClient.post("/login", { email, password });
      const { user, token } = response.data;
      sessionStorage.setItem('token', token);
      this.user = user;
      this.token = token;
    },
    async fetchToken() {
      if (!this.token) { // Check if token is empty
        const response = await apiClient.get("/auth/token");
        this.token = response.data.token;
        sessionStorage.setItem("token", this.token); // Store in sessionStorage
      }
    },
    async fetchUser() {
      try {
        const response = await apiClient.get("/user");
        this.user = response.data;
      } catch (_) {
        this.user = null;
      }
    },
    async initializeAuth() {
      if (!this.token) {
        await this.fetchToken();
      }
      await this.fetchUser();
    },
    async logout(router) {
      await apiClient.post("/logout");
      this.user = null;
      router.push("/login");
    },
  },
});