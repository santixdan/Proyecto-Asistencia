const Ficha = require("./../models/fichas.js")
const Aprendiz = require("./../models/aprendices.js")

const apredizHelpers = {
    validarFicha: async (ficha) => {
        let existeFicha = await Ficha.findOne({ _id: ficha })
        if (!existeFicha) {
            throw new Error("La ficha no existe en la base de datos")
        } else {
            return true
        }
    },
    validarFichaActiva: async (ficha) => {
        let existeFicha = await Ficha.findOne({ _id: ficha })
        if (existeFicha.estado === 0) {
            throw new Error("La ficha está inactiva")
        } else {
            return true
        }
    },
    validarId: async (id) => {
        let existeId = await Aprendiz.findById(id)
        if (!existeId) {
            throw new Error("El aprendiz no existe en la base de datos")
        } else {
            return true
        }
    },
    validarEmailAprendiz: async (email) => {
        let existeEmailAprendiz = await Aprendiz.findOne({ email })
        if (existeEmailAprendiz) {
            throw new Error("El email ya existe")
        } else {
            return true
        }
    },
    validarEmailSiEsDiferente: async (email, id) => {
        const aprendiz = await Aprendiz.findById(id);
        if (email && email !== aprendiz.email) {
            let existeEmailAprendiz = await Aprendiz.findOne({ email });
            if (existeEmailAprendiz) {
                throw new Error("El email ya existe");
            } else {
                return true
            }
        } else {
            return true
        }
    },
    validarCedulaAprendiz: async (cedula) => {
        let existeCedulaAprendiz = await Aprendiz.findOne({ cedula })
        if (existeCedulaAprendiz) {
            throw new Error("La cédula ya existe")
        } else {
            return true
        }
    },
    validarCedulaSiEsDiferente: async (cedula, id) => {
        const aprendiz = await Aprendiz.findById(id);
        if (cedula && cedula !== aprendiz.cedula) {
            let existeCedulaAprendiz = await Aprendiz.findOne({ cedula });
            if (existeCedulaAprendiz) {
                throw new Error("La cédula ya existe");
            } else {
                return true
            }
        } else {
            return true
        }
    },
    validarTelefonoAprendiz: async (telefono) => {
        let existeTelefonoAprendiz = await Aprendiz.findOne({ telefono })
        if (existeTelefonoAprendiz) {
            throw new Error("El teléfono ya existe")
        } else {
            return true
        }
    },
    validarTelefonoSiEsDiferente: async (telefono, id) => {
        const aprendiz = await Aprendiz.findById(id);
        if (telefono && telefono !== aprendiz.telefono) {
            let existeTelefonoAprendiz = await Aprendiz.findOne({ telefono });
            if (existeTelefonoAprendiz) {
                throw new Error("El teléfono ya existe")
            } else {
                return true
            }
        } else {
            return true
        }
    },
}

module.exports = { apredizHelpers };