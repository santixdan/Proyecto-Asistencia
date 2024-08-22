import { defineStore } from "pinia"
import axios from "axios"
import { ref } from "vue"

let validar = ref(true)
let loading = ref(false)

export const useBitacoraStore = defineStore("bitacora", () => {
    let xtoken = ref()
    async function getListarBitacora() {
        try {
            let r = await axios.get("http://localhost:4000/bitacoras/listarTodo")
            console.log(r);
            return r
        } catch (error) {
            console.log(error);
            return error
        }
    }
    async function postCrearBitacora(aprendiz, fecha) {
        loading.value = true
        try {
            let r = await axios.post(`http://localhost:4000/bitacoras/crear`, {
                aprendiz,
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

    async function putModificarBitacora(aprendiz, fecha, id) {
        loading.value = true
        try {
            let r = ref()
            if (aprendiz){
                r.value = await axios.put(`http://localhost:4000/bitacoras/modificar/${id}`, {
                    aprendiz
                })
            }
            if (fecha){
                r.value = await axios.put(`http://localhost:4000/bitacoras/modificar/${id}`, {
                    fecha
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
        getListarBitacora, postCrearBitacora, putModificarBitacora, loading, xtoken
    }
})