import { createApp } from 'vue';
import App from './App.vue';
import { createPinia } from 'pinia';
import Vant from 'vant';
import 'vant/lib/index.css';

createApp(App).use(createPinia()).use(Vant).mount('#app');
