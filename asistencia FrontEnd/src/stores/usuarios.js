import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

const API_URL = 'https://proyecto-asistencia-backend.onrender.com';

export const useUsuarioStore = defineStore("usuario", () => {
    let xtoken = ref()
    let usuario = ref()
    let validar = ref(true)
    let loading = ref(false)
    async function getListarUsuarios() {
        loading.value = true
        try {
            let r = await axios.get(`${API_URL}/usuarios/listarTodos`, {
                headers: {
                    "token": xtoken.value
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
    async function postCrearUsuario(email, name, password) {
        loading.value = true
        try {
            let r = await axios.post(`${API_URL}/usuarios/crear`, {
                email,
                nombre: name,
                password
            }, {
                headers: {
                    "token": xtoken.value
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

    async function postLoginUsuario(email, password) {
        loading.value = true
        try {
            let r = await axios.post(`${API_URL}/usuarios/login`, {
                email,
                password
            })
            xtoken.value = r.data.token
            usuario.value = r.data.usuario
            validar.value = true
            return { r, validar }
        } catch (error) {
            validar.value = false
            return { error, validar }
        } finally {
            loading.value = false
        }
    }

    async function postEnviarEmail(email) {
        loading.value = true
        try {
            let r = await axios.post(`${API_URL}/usuarios/enviarEmail`, {
                email
            })
            validar.value = true
            return { r, validar }
        } catch (error) {
            validar.value = false
            return { error, validar }
        } finally {
            loading.value = false
        }
    }

    async function putModificarUsuario(email, name, id) {
        loading.value = true
        try {
            let r = ref()
            if (email) {
                r.value = await axios.put(`${API_URL}/usuarios/modificar/${id}`, {
                    email
                }, {
                    headers: {
                        "token": xtoken.value
                    }
                })
            }
            if (name) {
                r.value = await axios.put(`${API_URL}/usuarios/modificar/${id}`, {
                    nombre: name
                }, {
                    headers: {
                        "token": xtoken.value
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

    async function putModificarPassword( newPassword, confirmPassword, token) {
        loading.value = true
        try {
            let r = await axios.put(`${API_URL}/usuarios/modificarPassword`, {
                newPassword,
                confirmPassword,
                token
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

    async function putActivarUsuario(id) {
        loading.value = true
        try {
            let r = await axios.put(`${API_URL}/usuarios/activar/${id}`, {}, {
                headers: {
                    "token": xtoken.value
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
    async function putDesactivarUsuario(id) {
        loading.value = true
        try {
            let r = await axios.put(`${API_URL}/usuarios/desactivar/${id}`, {}, {
                headers: {
                    "token": xtoken.value
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
    return {
        getListarUsuarios, postCrearUsuario, postLoginUsuario, postEnviarEmail, putActivarUsuario, putDesactivarUsuario, putModificarPassword, putModificarUsuario, loading, xtoken, usuario
    }
}, {
    persist: {
        paths: ['xtoken', 'usuario']
    }
})
