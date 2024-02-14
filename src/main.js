import { createApp } from 'vue'
import App from './App.vue'
import './styles/index.scss'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
import store from './store/store'
import router from './router/router'

createApp(App).use(router).use(store).use(Toast).mount('#app')
