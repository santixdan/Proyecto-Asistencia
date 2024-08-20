import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

let validar = ref(true) 
let loading = ref()

export const useFichaStore = defineStore("ficha", () => {
    async function getListarFichas() {
        try {
            let r = await axios.get("http://localhost:4000/fichas/listarTodo")
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async function postCrearFicha(code, name) {
        loading.value = true
        try {
            let r = await axios.post(`http://localhost:4000/fichas/crear`, {
                codigo: code,
                nombre: name
            })
            validar.value = true
            return { r, validar }
        } catch (error) {
            validar.value = false
            console.log(error);
            return { error, validar }
        } finally {
            loading.value = false
        }
    }

    async function putModificarFicha(code, name, id) {
        loading.value = true
        try {
            let r = ref()
            if (code){
                r.value = await axios.put(`http://localhost:4000/fichas/modificar/${id}`, {
                    codigo: code
                })
            }
            if (name){
                r.value = await axios.put(`http://localhost:4000/fichas/modificar/${id}`, {
                    nombre: name
                })
            }
            validar.value = true
            return { r, validar }
        } catch (error) {
            validar.value = false
            console.log(error);
            return { error, validar }
        } finally {
            loading.value = false
        }
    }
    async function putActivarFicha(id) {
        try {
            let r = await axios.put(`http://localhost:4000/fichas/activar/${id}`)
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async function putDesactivarFicha(id) {
        try {
            let r = await axios.put(`http://localhost:4000/fichas/desactivar/${id}`)
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }
    return {
        getListarFichas, postCrearFicha, putActivarFicha, putDesactivarFicha, putModificarFicha, loading
    }
}, {
    persist: true
})