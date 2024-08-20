const Ficha = require("./../models/fichas.js")

const fichaHelpers = {
    validarCodigoFicha: async (codigo) => {
        let existeCodigoFicha = await Ficha.findOne({codigo})
        if (existeCodigoFicha) {
            throw new Error("El código ya existe")
        }
    },
    validarId: async (id) => {
        let existeId = await Ficha.findById(id)
        if (!existeId) {
            throw new Error("La ficha no existe en la base de datos")
        }
    }
}

module.exports = { fichaHelpers };