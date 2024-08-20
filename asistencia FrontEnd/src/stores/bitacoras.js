import { defineStore } from "pinia"
import axios from "axios"
import { ref } from 'vue'

let validar = ref()
let loading = ref()

export const useBitacoraStore = defineStore("bitacoras", () => {
    async function getListarBitacora() {
        try {
            let r = await axios.get("http://localhost:4000/bitacoras/listarTodo")
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async function putActivarBitacora(id) {
        try {
            let r = await axios.put(`http://localhost:4000/bitacoras/activar/${id}`)
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async function putDesactivarBitacora(id) {
        try {
            let r = await axios.put(`http://localhost:4000/bitacoras/desactivar/${id}`)
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }
    return {
        getListarBitacora, putActivarBitacora, putDesactivarBitacora
    }
}, {
    persist: true
})