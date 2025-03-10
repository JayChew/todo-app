import { defineStore } from "pinia";
import { useAuthStore } from "./auth";

export const useTasksStore = defineStore("tasksStore", {
  state: () => {
    return {
      errors: {},
    };
  },
  actions: {
    /******************* Get all tasks *******************/
    async getAllTasks() {
      const res = await fetch("/api/v1/tasks", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      const data = await res.json();
      return data.data;
    },
    /******************* Get a task *******************/
    async getTask(task) {
      const res = await fetch(`/api/v1/tasks/${task}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        }
      });
      const data = await res.json();

      return data.task;
    },
    /******************* Create a task *******************/
    async createTaks(formData) {
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
    },
    /******************* Delete a task *******************/
    async deleteTask(task) {
      const authStore = useAuthStore();
      if (authStore.user.id === task.user_id) {
        const res = await fetch(`/api/v1/tasks/${task.id}`, {
          method: "delete",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
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
      const authStore = useAuthStore();
      if (authStore.user.id === task.user_id) {
        const res = await fetch(`/api/v1/tasks/${task.id}`, {
          method: "put",
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
  },
});