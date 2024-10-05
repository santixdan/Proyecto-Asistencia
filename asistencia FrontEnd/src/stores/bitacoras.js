import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"
import { useUsuarioStore } from "./usuarios.js";

const API_URL = 'https://proyecto-asistencia-backend.onrender.com';
// const API_URL = 'http://localhost:4000';

export const useBitacoraStore = defineStore("bitacora", () => {
    let validar = ref(true)
    let loading = ref(false)
    let fechaBitacora = ref()
    let fichaBitacora = ref()
    async function getListarBitacora() {
        const useUsuario = useUsuarioStore()
        loading.value = true
        try {
            let r = await axios.get(`${API_URL}/bitacoras/listarTodo`, {
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
    async function getListarBitacoraPorFechaYFicha(fecha, ficha) {
        const useUsuario = useUsuarioStore();
        fechaBitacora.value = fecha
        fichaBitacora.value = ficha
        console.log(fecha);
        console.log(ficha);
        loading.value = true;
        try {
            let r = await axios.get(`${API_URL}/bitacoras/listarPorFechaYFicha/${ficha}`, {
                params: {
                    fechaInicio: fecha,
                    fechaFin: fecha
                },
                headers: {
                    "token": useUsuario.xtoken
                },
                withCredentials: true
            });
            validar.value = true
            return { r, validar }
        } catch (error) {
            validar.value = false
            console.log(error);
            return { error, validar }
        } finally {
            loading.value = false;
        }
    }
    async function getListarBitacoraPorFechaYFichaYEstado() {
        const useUsuario = useUsuarioStore();
        loading.value = true;

        try {
            let r = await axios.get(`${API_URL}/bitacoras/listarPorFechaYFichaYEstado/${fichaBitacora.value}`, {
                params: {
                    fechaInicio: fechaBitacora.value,
                    fechaFin: fechaBitacora.value
                },
                headers: {
                    "token": useUsuario.xtoken
                }
            });
            validar.value = true
            return { r, validar }
        } catch (error) {
            validar.value = false
            console.log(error);
            return { error, validar }
        } finally {
            loading.value = false;
        }
    }
    async function getListarBitacoraPorEstado() {
        const useUsuario = useUsuarioStore()
        loading.value = true
        try {
            let r = await axios.get(`${API_URL}/bitacoras/listarPorEstado`, {
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
    async function postCrearBitacora1(aprendiz, fecha) {
        loading.value = true
        const useUsuario = useUsuarioStore()
        try {
            let r = await axios.post(`${API_URL}/bitacoras/crear1`, {
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

    async function postCrearBitacora2(cedula, fecha) {
        loading.value = true
        try {
            let r = await axios.post(`${API_URL}/bitacoras/crear2`, {
                cedula,
                fecha
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

    async function putModificarBitacora(estado, id) {
        loading.value = true
        const useUsuario = useUsuarioStore()
        try {
            let r = ref()
            if (estado) {
                r.value = await axios.put(`${API_URL}/bitacoras/modificar/${id}`, {
                    estado
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
        getListarBitacora, getListarBitacoraPorFechaYFicha, getListarBitacoraPorFechaYFichaYEstado, getListarBitacoraPorEstado, postCrearBitacora1, postCrearBitacora2, putModificarBitacora, loading, fechaBitacora, fichaBitacora
    }
}, {
    persist: {
        paths: ['fechaBitacora', 'fichaBitacora']
    }
})