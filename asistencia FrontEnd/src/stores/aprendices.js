import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { useUsuarioStore } from "./usuarios.js";

const API_URL = 'https://proyecto-asistencia-backend.onrender.com';
// const API_URL = 'http://localhost:4000';

export const useAprendizStore = defineStore("aprendiz", () => {
    let validar = ref(true)
    let loading = ref(false)

    async function getListarAprendiz() {
        const useUsuario = useUsuarioStore()
        loading.value = true
        try {
            let r = await axios.get(`${API_URL}/aprendices/listarTodo`, {
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
    async function postCrearAprendiz(ficha, cedula, name, telefono, email, firma) {
        loading.value = true
        const useUsuario = useUsuarioStore()
        try {
            let formData = new FormData(); // Crea una instancia de FormData
            formData.append('ficha', ficha);
            formData.append('cedula', cedula);
            formData.append('nombre', name);
            formData.append('telefono', telefono);
            formData.append('email', email);
            formData.append('firma', firma);
            let r = await axios.post(`${API_URL}/aprendices/crear`, formData, {
                headers: {
                    "token": useUsuario.xtoken,
                    'Content-Type': 'multipart/form-data'
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

    async function putModificarAprendiz(ficha, cedula, name, telefono, email, firma, id) {
        loading.value = true
        const useUsuario = useUsuarioStore()
        try {
            let r = ref()
            if (email) {
                r.value = await axios.put(`${API_URL}/aprendices/modificar/${id}`, {
                    email
                }, {
                    headers: {
                        "token": useUsuario.xtoken
                    }
                })
            }
            if (name) {
                r.value = await axios.put(`${API_URL}/aprendices/modificar/${id}`, {
                    nombre: name
                }, {
                    headers: {
                        "token": useUsuario.xtoken
                    }
                })
            }
            if (ficha) {
                r.value = await axios.put(`${API_URL}/aprendices/modificar/${id}`, {
                    ficha
                }, {
                    headers: {
                        "token": useUsuario.xtoken
                    }
                })
            }
            if (cedula) {
                r.value = await axios.put(`${API_URL}/aprendices/modificar/${id}`, {
                    cedula
                }, {
                    headers: {
                        "token": useUsuario.xtoken
                    }
                })
            }
            if (telefono) {
                r.value = await axios.put(`${API_URL}/aprendices/modificar/${id}`, {
                    telefono
                }, {
                    headers: {
                        "token": useUsuario.xtoken
                    }
                })
            }
            if (firma) {
                r.value = await axios.put(`${API_URL}/aprendices/modificar/${id}`, {
                    firma
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
    async function putActivarAprendiz(id) {
        const useUsuario = useUsuarioStore()
        try {
            let r = await axios.put(`${API_URL}/aprendices/activar/${id}`, {}, {
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
    async function putDesactivarAprendiz(id) {
        const useUsuario = useUsuarioStore()
        try {
            let r = await axios.put(`${API_URL}/aprendices/desactivar/${id}`, {}, {
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
        getListarAprendiz, postCrearAprendiz, putActivarAprendiz, putDesactivarAprendiz, putModificarAprendiz, loading
    }
})