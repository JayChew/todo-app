import { defineStore } from "pinia";

export const useAuthStore = defineStore("authStore", {
  state: () => {
    return {
      user: null,
      token: `Bearer ${localStorage.getItem("token")}` || null,
      errors: {},
    };
  },
  actions: {
    async fetchUser() {
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
        method: "post",
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (data.errors) {
        this.errors = data.errors;
      } else {
        this.errors = {};
        localStorage.setItem("token", data.token);
        this.user = data.user;
      }
    },
    async logout() {
      const res = await fetch("/api/v1/logout", {
        method: "post",
        headers: {
          authorization: `Bearer ${this.token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        this.user = null;
        this.errors = {};
        localStorage.removeItem("token");
        this.router.push("/login");
      }
    }
  }
})