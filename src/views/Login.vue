<script setup>
import { ref } from "vue";
import { useAuthStore } from "../stores/authStore";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const authStore = useAuthStore();
const router = useRouter();

const login = async () => {
  try {
    await authStore.login(email.value, password.value);
    router.push("/tasks");
  } catch (error) {
    alert("登录失败");
  }
};
</script>

<template>
  <div>
    <h2>登录</h2>
    <input v-model="email" placeholder="邮箱" type="email" />
    <input v-model="password" placeholder="密码" type="password" />
    <button @click="login">登录</button>
  </div>
</template>
