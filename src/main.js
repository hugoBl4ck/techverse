import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/globals.css'
import { getAuth, onAuthStateChanged } from 'firebase/auth'

let app;
const auth = getAuth();

onAuthStateChanged(auth, () => {
  if (!app) {
    app = createApp(App)
    app.use(router)
    app.mount('#app')
  }
});
