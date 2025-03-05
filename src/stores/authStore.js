import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || "",
  }),
  actions: {
    async login(email, password) {
      try {
        const response = await axios.post("/login", { email, password });
        // Destructure the response
        const { user, token } = response.data;
        this.token = token;
        this.user = user;
        localStorage.setItem("token", this.token);

        if (this.token) {
          axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;
        }
      } catch (error) {
        console.error("Login error:", error);
        throw new Error("Invalid credentials or server error.");
      }
    },
    async fetchUser() {
      axios.defaults.headers.common["Authorization"] = `Bearer ${this.token}`;

      try {
        const response = await axios.get("/user");
        this.user = response.data;
      } catch (error) {
        this.user = null;
        console.error("Fetch user error:", error);
      }
    },
    async logout(router) {

      try {
        await axios.post("/logout");
      } catch (error) {
        console.error("Logout error:", error);
      }
      this.token = "";
      this.user = null;
      localStorage.removeItem("token");
      delete axios.defaults.headers.common["Authorization"];

      // Redirect to login page after logout
      router.push("/login");
    },
  },
});