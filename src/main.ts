import { createApp, Plugin } from 'vue'
import './style.css'
import App from './App.vue'
import i18n from './plugins/i18n.js';
import router from './router.ts';
import { createPinia } from 'pinia'

const pinia = createPinia();

createApp(App)
.use(router)
.use(i18n as Plugin)
.use(pinia)
.mount('#app')
