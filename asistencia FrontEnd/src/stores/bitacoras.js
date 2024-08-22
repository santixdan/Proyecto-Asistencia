import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { useUsuarioStore } from "./usuarios.js";

export const useBitacoraStore = defineStore("bitacora", () => {
    let validar = ref(true)
    let loading = ref(false)
    async function getListarBitacora() {
        const useUsuario = useUsuarioStore()
        try {
            let r = await axios.get("http://localhost:4000/bitacoras/listarTodo", {
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
    async function postCrearBitacora(aprendiz, fecha) {
        loading.value = true
        const useUsuario = useUsuarioStore()
        try {
            let r = await axios.post(`http://localhost:4000/bitacoras/crear`, {
                aprendiz,
                fecha
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

    async function putModificarBitacora(aprendiz, fecha, id) {
        loading.value = true
        const useUsuario = useUsuarioStore()
        try {
            let r = ref()
            if (aprendiz) {
                r.value = await axios.put(`http://localhost:4000/bitacoras/modificar/${id}`, {
                    aprendiz
                }, {
                    headers: {
                        "token": useUsuario.xtoken
                    }
                })
            }
            if (fecha) {
                r.value = await axios.put(`http://localhost:4000/bitacoras/modificar/${id}`, {
                    fecha
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

    return {
        getListarBitacora, postCrearBitacora, putModificarBitacora, loading
    }
})