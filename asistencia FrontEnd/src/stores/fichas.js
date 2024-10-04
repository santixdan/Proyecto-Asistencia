import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { useUsuarioStore } from "./usuarios.js";

const API_URL = 'https://proyecto-asistencia-backend.onrender.com';
// const API_URL = 'http://localhost:4000';

export const useFichaStore = defineStore("ficha", () => {
    let validar = ref(true)
    let loading = ref(false)
    async function getListarFichas() {
        const useUsuario = useUsuarioStore()
        loading.value = true
        try {
            let r = await axios.get(`${API_URL}/fichas/listarTodo`, {
                headers: {
                    "token": useUsuario.xtoken
                }
            })
            return r
        } catch (error) {
            console.log(error);
            return error
        } finally {
            loading.value = false
        }
    }
    async function postCrearFicha(code, name) {
        loading.value = true
        const useUsuario = useUsuarioStore()
        try {
            let r = await axios.post(`${API_URL}/fichas/crear`, {
                codigo: code,
                nombre: name
            }, {
                headers: {
                    "token": useUsuario.xtoken
                }
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
        const useUsuario = useUsuarioStore()
        try {
            let r = ref()
            if (code) {
                r.value = await axios.put(`${API_URL}/fichas/modificar/${id}`, {
                    codigo: code
                }, {
                    headers: {
                        "token": useUsuario.xtoken
                    }
                })
            }
            if (name) {
                r.value = await axios.put(`${API_URL}/fichas/modificar/${id}`, {
                    nombre: name
                }, {
                    headers: {
                        "token": useUsuario.xtoken
                    }
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
        const useUsuario = useUsuarioStore()
        try {
            let r = await axios.put(`${API_URL}/fichas/activar/${id}`, {}, {
                headers: {
                    "token": useUsuario.xtoken
                }
            })
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async function putDesactivarFicha(id) {
        const useUsuario = useUsuarioStore()
        try {
            let r = await axios.put(`${API_URL}/fichas/desactivar/${id}`, {}, {
                headers: {
                    "token": useUsuario.xtoken
                }
            })
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }
    return {
        getListarFichas, postCrearFicha, putActivarFicha, putDesactivarFicha, putModificarFicha, loading
    }
})