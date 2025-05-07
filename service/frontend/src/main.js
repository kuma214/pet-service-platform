import { createApp } from 'vue';
import App from './App.vue';
import router from '@/routes/index';
import axios from 'axios';
import { createPinia } from 'pinia';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue-next/dist/bootstrap-vue-next.css'; // BootstrapVue 스타일
import VueTypewriterEffect from 'vue-typewriter-effect';

window.__VUE_PROD_HYDRATION_MISMATCH_DETAILS__ = false;
const app = createApp(App);
const pinia = createPinia();

app.config.globalProperties.$axios = axios;
axios.defaults.baseURL = '/api'; // 프록시를 통해 백엔드와 통신
axios.defaults.withCredentials = true; // 쿠키 전송 설정

// Pinia 생성 및 등록
app.use(pinia);

// Vue Router 등록 (선택사항)
app.use(router);

app.component('vue-typewriter-effect', VueTypewriterEffect);

// 애플리케이션 마운트
app.mount('#app');
