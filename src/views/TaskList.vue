<script setup>
import { ref, onMounted, onUnmounted, watch } from "vue";
import axios from "axios";
import echo from "../utils/echo";
import { useAuthStore } from "../stores/authStore";

const tasks = ref([]);
const authStore = useAuthStore();

const fetchTasks = async () => {
  if (!authStore.user) return;
  try {
    const { data } = await axios.get("/tasks", {
      headers: { Authorization: `Bearer ${authStore.token}` },
    });
    tasks.value = data.data;
  } catch (error) {
    console.error("获取任务失败:", error);
  }
};

const subscribeToTaskListUpdates = (userId) => {
  return echo
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
      taskChannel.stop(); // Unsubscribe from previous channel
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
    taskChannel.stop();
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
