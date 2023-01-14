import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './plugins/router'
import {createPinia} from "pinia";
import MetaInfo from "@/components/MetaInfo.vue";


const pinia = createPinia();

const app = createApp(App);
app.component('MetaInfo', MetaInfo);
app.use(pinia);
app.use(router);
app.mount('#app');
