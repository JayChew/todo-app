import { defineStore } from "pinia";
import { getCsrfToken } from "@/utils/csrfToken"; // Adjust path based on your project structure

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
      if (this.token) {
        const res = await fetch("/api/v1/user", {
          headers: {
            authorization: `Bearer ${this.token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          this.user = data;
        }
      }
    },
    async authenticate(apiRoute, formData) {
      const res = await fetch(`/api/v1/${apiRoute}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(getCsrfToken()),
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.errors) {
        this.errors = data.errors;
      } else {
        this.errors = {};
        this.token = data.token;
        localStorage.setItem("token", data.token);
        this.user = data.user;
        this.router.push({ name: "home" });
      }
    },
    async logout() {
      const res = await fetch("/api/v1/logout", {
        method: "post",
        headers: {
          authorization: `Bearer ${this.token}`,
          "Content-Type": "application/json",
          "X-XSRF-TOKEN": decodeURIComponent(getCsrfToken()),
        },
        credentials: "include"
      });

      if (res.ok) {
        this.user = null;
        this.errors = {};
        localStorage.removeItem("token");
        this.router.push({ name: "home" });
      }
    },
  },
});