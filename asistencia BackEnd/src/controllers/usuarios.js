const Usuario = require("./../models/usuarios.js")
const bcryptjs = require("bcryptjs")
const { generarJWT } = require("../middlewares/validarJWT")

const httpUsuario = {
    getListarUsuarios: async (req, res) => {
        try {
            const usuarios = await Usuario.find()
            res.json({ usuarios })
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    postCrearUsuarios: async (req, res) => {
        try {
            const { email, password, nombre } = req.body
            const newUsuario = new Usuario({ email, password, nombre })
            const salt = bcryptjs.genSaltSync();
            newUsuario.password = bcryptjs.hashSync(password, salt)
            await newUsuario.save()
            res.json({ newUsuario })
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    postLoginUsuario: async (req, res) => {
        try {
            const { email, password } = req.body
            const usuario = await Usuario.findOne({ email })
            const token = await generarJWT(usuario._id);
            res.json({ usuario, token })
        } catch (error) {
            res.status(400).json({ error })
        }

    },
    putModificarUsuarios: async (req, res) => {
        try {
            const id = req.params.id;
            const { email, password, nombre } = req.body
            const usuario = await Usuario.findById(id)
            if (email) {
                usuario.email = email;
            }
            if (nombre) {
                usuario.nombre = nombre;
            }
            await usuario.save();
            res.json({ usuario });
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    putActivarUsuario: async (req, res) => {
        try {
            const id = req.params.id
            const usuario = await Usuario.findByIdAndUpdate(id, { estado: 1 })
            res.json({ msg: "Usuario Activado" })
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    putDesactivarUsuario: async (req, res) => {
        try {
            const id = req.params.id
            const usuario = await Usuario.findByIdAndUpdate(id, { estado: 0 })
            res.json({ msg: "Usuario Desactivado" })
        } catch (error) {
            res.status(400).json({ error })
        }
    }
}

module.exports = { httpUsuario }