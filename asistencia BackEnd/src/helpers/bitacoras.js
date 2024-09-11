const Aprendiz = require("./../models/aprendices.js")
const Bitacora = require("./../models/bitacoras.js")

const bitacoraHelpers = {
    validarAprendiz1: async (aprendiz) => {
        let existeAprendiz = await Aprendiz.findOne({_id:aprendiz})
        if (!existeAprendiz) {
            throw new Error("El aprendiz no existe en la base de datos")
        }
    },
    validarAprendiz2: async (cedula) => {
        let existeAprendiz = await Aprendiz.findOne({cedula})
        if (!existeAprendiz) {
            throw new Error("El aprendiz no existe en la base de datos")
        }
    },
    validarAprendizActivo1: async (aprendiz) => {
        let existeAprendiz = await Aprendiz.findOne({_id:aprendiz})
        if (existeAprendiz.estado === 0) {
            throw new Error("El aprendiz está inactivo")
        }
    },
    validarAprendizActivo2: async (cedula) => {
        let existeAprendiz = await Aprendiz.findOne({cedula})
        if (existeAprendiz.estado === 0) {
            throw new Error("El aprendiz está inactivo")
        }
    },
    validarId: async (id) => {
        let existeId = await Bitacora.findById(id)
        if (!existeId) {
            throw new Error("La bitácora no existe en la base de datos")
        }
    },
    validarEstado: (estado) => {
        const estadosValidos = ["Asistió", "No asistió", "Excusa", "Pendiente"];
        if (!estadosValidos.includes(estado)) {
            throw new Error("El estado de la bitácora debe ser 'Asistió', 'No asistió', 'Excusa' o 'Pendiente'");
        }
        return true;
    }
}
module.exports = { bitacoraHelpers };