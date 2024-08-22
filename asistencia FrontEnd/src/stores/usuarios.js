import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"



export const useUsuarioStore = defineStore("usuario", () => {
    let xtoken = ref()
    let usuario = ref()
    let validar = ref(true)
    let loading = ref(false)
    async function getListarUsuarios() {
        try {
            let r = await axios.get("http://localhost:4000/usuarios/listarTodos", {
                headers: {
                    "token": xtoken.value
                }
            })
            console.log(r);
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async function postCrearUsuario(email, name, password) {
        loading.value = true
        try {
            let r = await axios.post(`http://localhost:4000/usuarios/crear`, {
                email,
                nombre: name,
                password
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
        try {
            let r = await axios.post(`http://localhost:4000/usuarios/login`, {
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
        }
    }

    async function putModificarUsuario(email, name, password, id) {
        loading.value = true
        try {
            let r = ref()
            if (email) {
                r.value = await axios.put(`http://localhost:4000/usuarios/modificar/${id}`, {
                    email
                }, {
                    headers: {
                        "token": xtoken.value
                    }
                })
            }
            if (name) {
                r.value = await axios.put(`http://localhost:4000/usuarios/modificar/${id}`, {
                    nombre: name
                }, {
                    headers: {
                        "token": xtoken.value
                    }
                })
            }
            if (password) {
                r.value = await axios.put(`http://localhost:4000/usuarios/modificar/${id}`, {
                    password
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
    async function putActivarUsuario(id) {
        try {
            let r = await axios.put(`http://localhost:4000/usuarios/activar/${id}`, {}, {
                headers: {
                    "token": xtoken.value
                }
            })
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async function putDesactivarUsuario(id) {
        try {
            let r = await axios.put(`http://localhost:4000/usuarios/desactivar/${id}`, {}, {
                headers: {
                    "token": xtoken.value
                }
            })
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }
    return {
        getListarUsuarios, postCrearUsuario, postLoginUsuario, putActivarUsuario, putDesactivarUsuario, putModificarUsuario, loading, xtoken, usuario
    }
})