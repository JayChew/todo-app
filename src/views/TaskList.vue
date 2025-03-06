<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import { apiClient } from "../api";
import echoInstance from "../utils/echo";
import { useAuthStore } from "../stores/authStore";

const tasks = ref([]);
const authStore = useAuthStore();
authStore.fetchToken();

const fetchTasks = async () => {
  if (!authStore.user) return;
  try {
    const { data } = await apiClient.get("/tasks");
    tasks.value = data.data;
  } catch (error) {}
};

const subscribeToTaskListUpdates = (userId) => {
  return echoInstance(authStore.token)
    .private(`tasks.${userId}`)
    .listen("TaskListUpdated", ({ task }) => {
      const index = tasks.value.findIndex((t) => t.id === task.id);
      index !== -1 ? (tasks.value[index] = task) : tasks.value.push(task);
    });
};

let taskChannel = null;
watch(
  () => authStore.user,
  async (newUser, oldUser) => {
    if (taskChannel) {
      echoInstance(authStore.token).leave(`tasks.${authStore.user.id}`);
    }
    if (newUser) {
      await fetchTasks();
      taskChannel = subscribeToTaskListUpdates(newUser.id);
    }
  },
  { immediate: true }
);

onUnmounted(() => {
  if (taskChannel) {
    echoInstance(authStore.token).leave(`tasks.${authStore.user.id}`);
  }
});
</script>

<template>
  <div>
    <h2>任务列表</h2>
    <ul>
      <li v-for="task in tasks" :key="task.id">
        {{ task.title }} - <strong>{{ task.completed }}</strong>
      </li>
    </ul>
  </div>
</template>
