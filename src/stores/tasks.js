import { defineStore } from "pinia";
import { useAuthStore } from "./auth";
import apiClient from "@/api/axios";
import { useRouter } from "vue-router";

export const useTasksStore = defineStore("tasksStore", {
  state: () => ({
    errors: {},
  }),
  getters: {
    authStore: () => useAuthStore(), // Use a getter to access the auth store
  },
  actions: {
    /******************* Get all tasks *******************/
    async getAllTasks() {
      if (!this.authStore.token) return;

      try {
        const response = await apiClient.get("/api/v1/tasks");
        return response.data.data;
      } catch (error) {
        console.error("Error fetching tasks:", error);
        this.errors = error.response?.data || {};
      }
    },

    /******************* Get a task *******************/
    async getTask(task_id) {
      if (!this.authStore.token) return;

      try {
        const response = await apiClient.get(`/api/v1/tasks/${task_id}`);
        return response.data.task;
      } catch (error) {
        console.error("Error fetching task:", error);
        this.errors = error.response?.data || {};
      }
    },

    /******************* Create a task *******************/
    async createTask(formData) {
      if (!this.authStore.token) return;

      try {
        const response = await apiClient.post("/api/v1/tasks/", JSON.stringify(formData), {
          headers: { "Content-Type": "application/json" },
        });
        return response.data;
      } catch (error) {
        console.error("Error creating task:", error);
        this.errors = error.response?.data || {};
      }
    },

    /******************* Delete a task *******************/
    async deleteTask(task) {
      if (this.authStore.user?.id !== task.user_id) return;

      try {
        await apiClient.delete(`/api/v1/tasks/${task.id}`);
      } catch (error) {
        console.error("Error deleting task:", error);
        this.errors = error.response?.data || {};
      }
    },

    /******************* Update a task *******************/
    async updateTask(task, formData) {
      if (this.authStore.user?.id !== task.user_id) return;

      try {
        const response = await apiClient.put(`/api/v1/tasks/${task.id}`, JSON.stringify(formData), {
          headers: { "Content-Type": "application/json" },
        });
        return response.data;
      } catch (error) {
        console.error("Error updating task:", error);
        this.errors = error.response?.data || {};
      }
    },
  },
});
