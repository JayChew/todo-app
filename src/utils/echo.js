import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuthStore } from "@/stores/auth";

window.Pusher = Pusher;

const echoInstance = (bearerToken) => {
  return new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: `${import.meta.env.VITE_BACKEND_BASE_URL}api/v1/broadcasting/auth`, // Use configured base URL
    auth: {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    },
  });
}

export const subscribeToTaskListUpdates = () => {
  const authStore = useAuthStore();
  if (authStore.user) {
    return echoInstance(authStore.token)
      .private(`tasks.${authStore.user.id}`)
      .listen("TaskListUpdated", ({ task }) => {
        const index = tasks.value.findIndex((t) => t.id === task.id);
        index !== -1 ? (tasks.value[index] = task) : tasks.value.push(task);
      });
  }
};
