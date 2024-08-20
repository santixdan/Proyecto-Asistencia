import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

let validar = ref(true)
let loading = ref(false)

export const useAprendizStore = defineStore("aprendiz", () => {
    let xtoken = ref()
    let aprendiz = ref()
    async function getListarAprendiz() {
        try {
            let r = await axios.get("http://localhost:4000/aprendices/listarTodo")
            console.log(r);
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async function postCrearAprendiz(ficha, cedula, name, telefono, email) {
        loading.value = true
        try {
            let r = await axios.post(`http://localhost:4000/aprendices/crear`, {
                ficha,
                cedula,
                nombre: name,
                telefono,
                email
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

    async function putModificarAprendiz(ficha, cedula, name, telefono, email, id) {
        loading.value = true
        try {
            let r = ref()
            if (email){
                r.value = await axios.put(`http://localhost:4000/aprendices/modificar/${id}`, {
                    email
                })
            }
            if (name){
                r.value = await axios.put(`http://localhost:4000/aprendices/modificar/${id}`, {
                    nombre: name
                })
            }
            if (ficha){
                r.value = await axios.put(`http://localhost:4000/aprendices/modificar/${id}`, {
                    ficha
                })
            }
            if (cedula){
                r.value = await axios.put(`http://localhost:4000/aprendices/modificar/${id}`, {
                    cedula
                })
            }
            if (telefono){
                r.value = await axios.put(`http://localhost:4000/aprendices/modificar/${id}`, {
                    telefono
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
    async function putActivarAprendiz(id) {
        try {
            let r = await axios.put(`http://localhost:4000/aprendices/activar/${id}`)
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async function putDesactivarAprendiz(id) {
        try {
            let r = await axios.put(`http://localhost:4000/aprendices/desactivar/${id}`)
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }
    return {
        getListarAprendiz, postCrearAprendiz, putActivarAprendiz, putDesactivarAprendiz, putModificarAprendiz, loading, xtoken, aprendiz
    }
})