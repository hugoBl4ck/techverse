import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/globals.css'

import { db } from '@/firebase/config.js';
import { collection, addDoc } from 'firebase/firestore';

async function addPecaOnce() {
  try {
    const docRef = await addDoc(collection(db, "pecas"), {
      nome: "Placa-Mãe B450M Steel Legend",
      quantidade: 5,
      preco: 400,
      tipo: "placa-mae",
    });
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}
addPecaOnce();

const app = createApp(App)

app.use(router)
app.mount('#app')
