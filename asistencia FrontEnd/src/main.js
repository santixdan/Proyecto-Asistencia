// FILE: main.js

import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'
import { createPinia } from 'pinia'
import {router} from "./routes/routes.js"
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Import icon libraries
import '@quasar/extras/material-icons/material-icons.css'

// Import Quasar css
import 'quasar/src/css/index.sass'

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'

const pinia = createPinia()

pinia.use(piniaPluginPersistedstate)

const myApp = createApp(App)
myApp.use(router)
myApp.use(Quasar, {
  plugins: { Notify }, // import Quasar plugins and add here
})

// Assumes you have a <div id="app"></div> in your index.html

myApp.use(pinia)
myApp.mount('#app')

