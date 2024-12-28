import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import { type FirebaseConfig, initFirebase } from "./lib/firebase";

const env: FirebaseConfig = "dev";

const { analytics, auth, db } = initFirebase(env);
export { analytics, auth, db };

const app = createApp(App)

app.use(createPinia())
app.use(router)

const meta = document.createElement("meta");
meta.name = "naive-ui-style";
document.head.appendChild(meta);

// provide access to global window
app.config.globalProperties.window = window;

app.mount('#app')
