const Ficha = require("./../models/fichas.js")
const Aprendiz = require("./../models/aprendices.js")

const apredizHelpers = {
    validarFicha: async (ficha) => {
        let existeFicha = await Ficha.findOne({ _id: ficha })
        if (!existeFicha) {
            throw new Error("La ficha no existe en la base de datos")
        }
    },
    validarId: async (id) => {
        let existeId = await Aprendiz.findById(id)
        if (!existeId) {
            throw new Error("El aprendiz no existe en la base de datos")
        }
    },
    validarEmailAprendiz: async (email) => {
        let existeEmailAprendiz = await Aprendiz.findOne({ email })
        if (existeEmailAprendiz) {
            throw new Error("El email ya existe")
        }
    },
    validarEmailSiEsDiferente: async (email, id) => {
        const aprendiz = await Aprendiz.findById(id);
        if (email && email !== aprendiz.email) {
            let existeEmailAprendiz = await Aprendiz.findOne({ email });
            if (existeEmailAprendiz) {
                throw new Error("El email ya existe");
            }
        }
    },
    validarCedulaAprendiz: async (cedula) => {
        let existeCedulaAprendiz = await Aprendiz.findOne({ cedula })
        if (existeCedulaAprendiz) {
            throw new Error("La cédula ya existe")
        }
    },
    validarCedulaSiEsDiferente: async (cedula, id) => {
        const aprendiz = await Aprendiz.findById(id);
        if (cedula && cedula !== aprendiz.cedula) {
            let existeCedulaAprendiz = await Aprendiz.findOne({ cedula });
            if (existeCedulaAprendiz) {
                throw new Error("La cédula ya existe");
            }
        }
    },
    validarTelefonoAprendiz: async (telefono) => {
        let existeTelefonoAprendiz = await Aprendiz.findOne({ telefono })
        if (existeTelefonoAprendiz) {
            throw new Error("El teléfono ya existe")
        }
    },
    validarTelefonoSiEsDiferente: async (telefono, id) => {
        const aprendiz = await Aprendiz.findById(id);
        if (telefono && telefono !== aprendiz.telefono) {
            let existeTelefonoAprendiz = await Aprendiz.findOne({ telefono });
            if (existeTelefonoAprendiz) {
                throw new Error("El teléfono ya existe")
            }
        }
    },
}

module.exports = { apredizHelpers };