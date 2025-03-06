<script setup>
import { onMounted } from "vue";
import { useAuthStore } from "./stores/authStore";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

// 页面加载时检查用户是否已登录
onMounted(async () => {
  await authStore.fetchUser();

  if (!authStore.user) {
    router.push("/login");
  }
});
</script>

<template>
  <div>
    <nav v-if="authStore.user">
      <router-link to="/">Home</router-link> |
      <router-link to="/tasks">Tasks</router-link> |
      <button @click="authStore.logout(router)">Logout</button>
    </nav>

    <router-view />
  </div>
</template>
