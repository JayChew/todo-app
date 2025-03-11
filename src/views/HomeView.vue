<script setup>
import echoInstance from "@/utils/echo";
import { useTasksStore } from "@/stores/tasks";
import { useAuthStore } from "@/stores/auth";
import { onMounted, ref, watchEffect } from "vue";
import { RouterLink } from "vue-router";

const tasksStore = useTasksStore();
const authStore = useAuthStore();
const tasks = ref([]);

const subscribeToTaskListUpdates = () => {
  if (authStore.user) {
    return echoInstance(authStore.token)
      .private(`tasks.${authStore.user.id}`)
      .listen("TaskListUpdated", ({ task }) => {
        const index = tasks.value.findIndex((t) => t.id === task.id);
        index !== -1 ? (tasks.value[index] = task) : tasks.value.push(task);
      });
  }
};

const fetchTasks = async () => {
  tasks.value = [];
  if (authStore.user) {
    // Only fetch tasks if user is logged in
    tasks.value = await tasksStore.getAllTasks();
  }
};

// Watch for authentication changes and update tasks accordingly
watchEffect(() => {
  fetchTasks();
  subscribeToTaskListUpdates();
});
</script>

<template>
  <main>
    <h1 class="title">Latest Tasks</h1>

    <div v-if="tasks && tasks.length > 0">
      <div
        v-for="task in tasks"
        :key="task.id"
        class="border-l-4 border-blue-500 pl-4 mb-12"
      >
        <h2 class="font-bold text-3xl">{{ task.title }}</h2>
        <p class="text-xs text-slate-600 mb-4">
          Posted by {{ task.user.name }}
        </p>
        <p>{{ task.description }}</p>
      </div>
    </div>
    <div v-else>
      <h2 class="title">There are no tasks</h2>
    </div>
  </main>
</template>
