const Usuario = require("./../models/usuarios.js")
const bcryptjs = require("bcryptjs")

const usuarioHelpers = {
    validarEmailUsuario: async (email) => {
        let existeEmailUsuario = await Usuario.findOne({ email })
        if (existeEmailUsuario) {
            throw new Error("El email ya existe")
        }
    },
    validarNoEmailUsuario: async (email) => {
        let existeEmailUsuario = await Usuario.findOne({ email })
        if (!existeEmailUsuario) {
            throw new Error("El email no existe en la base de datos")
        }
    },
    validarEmailSiEsDiferente: async (email, id) => {
        const usuario = await Usuario.findById(id);
        if (email && email !== usuario.email) {
            let existeEmailUsuario = await Usuario.findOne({ email });
            if (existeEmailUsuario) {
                throw new Error("El email ya existe");
            }
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
    validarNewPassword: async (newPassword, confirmPassword) => {
        if (newPassword !== confirmPassword) {
            throw new Error("Las contraseñas no coinciden")
        }
    },
    validarId: async (id) => {
        let existeId = await Usuario.findById(id)
        if (!existeId) {
            throw new Error("El usuario no existe en la base de datos")
        }
    },
    validarUsuarioActivo: async (email) => {
        const usuario = await Usuario.findOne({ email });
        if (usuario.estado === 0) {
            throw new Error("El usuario está inactivo");
        }
    }
}

module.exports = { usuarioHelpers };