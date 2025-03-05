import { createApp } from "vue";
import { createPinia } from "pinia";
import axios from "axios";
import App from "./App.vue";
import router from "./router";

function getCookie(name) {
  let matches = document.cookie.match(new RegExp(
    "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
  ));
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

axios.defaults.baseURL = "http://localhost:8082/api/v1"; // Laravel API 地址
axios.defaults.withCredentials = true; // 允许携带 cookie
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';
axios.defaults.headers.common['X-XSRF-TOKEN'] = getCookie('XSRF-TOKEN');

const app = createApp(App);
app.use(createPinia());
app.use(router);
app.mount("#app");
