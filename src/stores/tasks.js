import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useTasksStore = defineStore("tasksStore", {
  state: () => {
    return {
      errors: {},
      authStore: useAuthStore(), // Define authStore once
    };
  },
  actions: {
    /******************* Get all tasks *******************/
    async getAllTasks() {
      if (!this.authStore.token) { return; }

      const res = await fetch("/api/v1/tasks", {
        headers: {
          Authorization: `Bearer ${this.authStore.token}`,
        }
      });
      const data = await res.json();
      return data.data;
    },
    /******************* Get a task *******************/
    async getTask(task) {
      if (this.authStore.token) {
        const res = await fetch(`/api/v1/tasks/${task}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          }
        });
        const data = await res.json();

        return data.task;
      }
    },
    /******************* Create a task *******************/
    async createTaks(formData) {
      if (this.authStore.token) {
        const res = await fetch("/api/v1/tasks", {
          method: "post",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();

        if (data.errors) {
          this.errors = data.errors;
        } else {
          this.router.push({ name: "home" });
          this.errors = {}
        }
      }
    },
    /******************* Delete a task *******************/
    async deleteTask(task) {
      if (this.authStore.user.id === task.user_id) {
        const res = await fetch(`/api/v1/tasks/${task.id}`, {
          method: "delete",
          headers: {
            Authorization: `Bearer ${this.authStore.token}`,
          },
        });

        const data = await res.json();
        if (res.ok) {
          this.router.push({ name: "home" });
        }
        console.log(data);
      }
    },
    /******************* Update a task *******************/
    async updateTask(task, formData) {
      if (this.authStore.user.id === task.user_id) {
        const res = await fetch(`/api/v1/tasks/${task.id}`, {
          method: "put",
          headers: {
            Authorization: `Bearer ${this.authStore.token}`,
          },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (data.errors) {
          this.errors = data.errors;
        } else {
          this.router.push({ name: "home" });
          this.errors = {}
        }
      }
    },
  },
});