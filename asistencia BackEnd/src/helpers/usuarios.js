const Usuario = require("./../models/usuarios.js")
const bcryptjs = require("bcryptjs")

const usuarioHelpers = {
    validarEmailUsuario: async (email) => {
        let existeEmailUsuario = await Usuario.findOne({ email })
        if (existeEmailUsuario) {
            throw new Error("El email ya existe")
        }
    },
    validarEmailSiEsDiferente: async (email, emailActual = null) => {
        if (email === emailActual) {
            return;
        }
        let existeEmailUsuario = await Usuario.findOne({ email });
        if (existeEmailUsuario) {
            throw new Error("El email ya existe");
        }
    },
    validarPasswordUsuario: async (email, password) => {
        const usuario = await Usuario.findOne({ email })
        if (!usuario) {
            throw new Error("Usuario o contraseña incorrecta")
        }
        const validPassword = bcryptjs.compareSync(password, usuario.password);
        if (!validPassword) {
            throw new Error("Usuario o contraseña incorrecta")
        }
    },
    validarId: async (id) => {
        let existeId = await Usuario.findById(id)
        if (!existeId) {
            throw new Error("El usuario no existe en la base de datos")
        }
    }
}

module.exports = { usuarioHelpers };