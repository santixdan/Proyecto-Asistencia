// FILE: main.js

import { createApp } from 'vue'
import { Quasar, Notify } from 'quasar'
import { createPinia } from 'pinia'
import { router } from './routes/routes.js'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

// Import icon libraries
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faHome } from '@fortawesome/free-solid-svg-icons'

// Import Quasar CSS
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import axios from 'axios';
// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from './App.vue'
axios.defaults.withCredentials = true;

const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)

// Add FontAwesome icons to the library
library.add(faHome)

const myApp = createApp(App)
myApp.use(router)
myApp.use(Quasar, {
  plugins: { Notify }, // import Quasar plugins and add here
})
myApp.use(pinia)

// Register the FontAwesome component globally
myApp.component('font-awesome-icon', FontAwesomeIcon)

// Assumes you have a <div id="app"></div> in your index.html
myApp.mount('#app')
