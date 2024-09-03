import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

axios.defaults.withCredentials = true;
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
                    "Content-Type": "application/json",
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
                    "Content-Type": "application/json",
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
            console.log(xtoken.value);
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

    async function putModificarUsuario(email, name, password, id) {
        loading.value = true
        try {
            let r = ref()
            if (email) {
                r.value = await axios.put(`${API_URL}/usuarios/modificar/${id}`, {
                    email
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "token": xtoken.value
                    }
                })
            }
            if (name) {
                r.value = await axios.put(`${API_URL}/usuarios/modificar/${id}`, {
                    nombre: name
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "token": xtoken.value
                    }
                })
            }
            if (password) {
                r.value = await axios.put(`${API_URL}/usuarios/modificar/${id}`, {
                    password
                }, {
                    headers: {
                        "Content-Type": "application/json",
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
    async function putActivarUsuario(id) {
        loading.value = true
        try {
            let r = await axios.put(`${API_URL}/usuarios/activar/${id}`, {}, {
                headers: {
                    "Content-Type": "application/json",
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
                    "Content-Type": "application/json",
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
        getListarUsuarios, postCrearUsuario, postLoginUsuario, putActivarUsuario, putDesactivarUsuario, putModificarUsuario, loading, xtoken, usuario
    }
}, {
    persist: {
        paths: ['xtoken', 'usuario']
    }
})
