import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;

const echoInstance = (bearerToken) => {
  return new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY,
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
    forceTLS: true,
    authEndpoint: `${import.meta.env.VITE_API_BASE_URL}/broadcasting/auth`, // Use configured base URL
    auth: {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${bearerToken}`
      }
    },
  });
}

export default echoInstance;
