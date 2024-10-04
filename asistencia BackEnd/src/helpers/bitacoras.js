const Aprendiz = require("./../models/aprendices.js")
const Bitacora = require("./../models/bitacoras.js")
const Ficha = require("./../models/fichas.js")

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
        } else {
            return true;
        }

    },
    validarFicha: async (ficha) => {
        let existeFicha = await Ficha.findOne({ _id: ficha })
        if (!existeFicha) {
            throw new Error("La ficha no existe en la base de datos")
        }
    },
    validarFecha1: async (fecha, aprendiz) => {
        let bitacoraAprendiz = await Bitacora.find({ aprendiz });
    
        let fechaSinHora = new Date(fecha).setHours(0, 0, 0, 0);
    
        let yaRegistrado = bitacoraAprendiz.some(bitacora => {
            let fechaBitacora = new Date(bitacora.fecha).setHours(0, 0, 0, 0);
            return fechaBitacora === fechaSinHora;
        });
    
        if (yaRegistrado) {
            throw new Error(`El aprendiz ya fue registrado en la fecha ${new Date(fecha).toLocaleDateString()}`);
        }
    },
    validarFecha2: async (fecha, cedula) => {
        let existeAprendiz = await Aprendiz.findOne({cedula})
        let bitacoraAprendiz = await Bitacora.find({ aprendiz : existeAprendiz._id });
    
        let fechaSinHora = new Date(fecha).setHours(0, 0, 0, 0);
    
        let yaRegistrado = bitacoraAprendiz.some(bitacora => {
            let fechaBitacora = new Date(bitacora.fecha).setHours(0, 0, 0, 0);
            return fechaBitacora === fechaSinHora;
        });
    
        if (yaRegistrado) {
            throw new Error(`El aprendiz ya fue registrado en la fecha ${new Date(fecha).toLocaleDateString()}`);
        }
    }
}
module.exports = { bitacoraHelpers };