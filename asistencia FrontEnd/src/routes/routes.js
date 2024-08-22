import Home from "../components/home.vue"
import Ficha from "../components/ficha.vue"
import Bitacora from "../components/bitacoras.vue"
import Aprendiz from "../components/aprendices.vue"
import Usuario from "../components/usuarios.vue"
import Login from "../components/login.vue"
import { createRouter, createWebHashHistory } from "vue-router"

const routes = [
    { path: "/", component: Login },
    { path: "/home", component: Home, children: [
            { path: "/ficha", component: Ficha },
            { path: "/bitacora", component: Bitacora },
            { path: "/aprendiz", component: Aprendiz },
            { path: "/usuario", component: Usuario }
        ]
    }]

export const router = createRouter({
    history: createWebHashHistory(),
    routes
})