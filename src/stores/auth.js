import { defineStore } from "pinia";
import apiClient from "@/api/axios";

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      user: null,
      errors: {},
      token: localStorage.getItem("token") || null
    };
  },
  actions: {
    async getUser() {
      try {
        const response = await apiClient.get("/api/v1/user");
        this.user = response.data;
      } catch (error) {
        this.errors = error.response?.data
      }
    },
    async authenticate(apiRoute, formData) {
      await apiClient.get("sanctum/csrf-cookie");

      try {
        const response = await apiClient.post(`/api/v1/${apiRoute}`, JSON.stringify(formData));
        const data = response.data;
        this.errors = {};
        this.token = data.token;
        localStorage.setItem("token", data.token);
        this.user = data.user;
        this.router.push({ name: "home" });
      } catch (error) {
        this.errors = error.response?.data.errors || {};
      }
    },
    async logout() {
      try {
        const response = await apiClient.post("/api/v1/logout");
        this.user = null;
        this.errors = {};
        localStorage.removeItem("token");
        this.router.push({ name: "home" });
      } catch (error) {

      }
    },
  },
});