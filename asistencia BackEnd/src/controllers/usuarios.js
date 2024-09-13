const Usuario = require("./../models/usuarios.js");
const bcryptjs = require("bcryptjs");
const { generarJWT } = require("../middlewares/validarJWT");
const nodemailer = require("nodemailer")
const jwt = require('jsonwebtoken');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "greycharlie812@gmail.com",
        pass: "grey12345"
    }
});

const httpUsuario = {
    getListarUsuarios: async (req, res) => {
        try {
            const usuarios = await Usuario.find();
            res.json({ usuarios });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    postEnviarEmail: async (req, res) => {
        try {
            const email = req.body.email.trim();
            const user = await Usuario.findOne({ email })
            const token = jwt.sign({ userId: user._id }, process.env.SECRETORPRIVATEKEY, { expiresIn: "1h" });
            const resetLink = `https://proyecto-asistencia-cxfa.onrender.com/#/recuperar?token=${token}`

            const mailOptions = {
                from: "greycharlie812@gmail.com",
                to: email,
                subject: "Restablecimiento de contraseña",
                text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    console.error(error);
                    return res.status(500).send("Error al enviar el correo electrónico.");
                }
                res.status(200).send("Correo electrónico enviado.");
            });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    postCrearUsuarios: async (req, res) => {
        try {
            const email = req.body.email.trim();
            const password = req.body.password.trim();
            const nombre = req.body.nombre.trim();

            const newUsuario = new Usuario({ email, password, nombre });
            const salt = bcryptjs.genSaltSync();
            newUsuario.password = bcryptjs.hashSync(password, salt);

            await newUsuario.save();
            res.json({ newUsuario });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    postLoginUsuario: async (req, res) => {
        try {
            const email = req.body.email.trim();
            const password = req.body.password.trim();

            const usuario = await Usuario.findOne({ email });
            const token = await generarJWT(usuario._id);
            res.json({ usuario, token });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    putModificarUsuarios: async (req, res) => {
        try {
            const id = req.params.id.trim();
            const email = req.body.email ? req.body.email.trim() : undefined;
            const nombre = req.body.nombre ? req.body.nombre.trim() : undefined;

            const usuario = await Usuario.findById(id);
            if (email) {
                usuario.email = email;
            }
            if (nombre) {
                usuario.nombre = nombre;
            }
            await usuario.save();
            res.json({ usuario });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    // putModificarPassword: async (req, res) => {
    //     try {
    //         const email = req.body.email.trim();
    //         const newPassword = req.body.newPassword.trim();

    //         const usuario = await Usuario.findOne({ email });
    //         const salt = bcryptjs.genSaltSync();
    //         usuario.password = bcryptjs.hashSync(newPassword, salt);

    //         await usuario.save();
    //         res.json({ usuario });
    //     } catch (error) {
    //         res.status(400).json({ error: "algo mal" });
    //     }
    // },
    putModificarPassword: async (req, res) => {
        const token = req.body.token.trim();
        const newPassword = req.body.newPassword.trim();
        try {
            const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
            // const hashedPassword = await bcryptjs.hash(newPassword, 10);
            const salt = bcryptjs.genSaltSync();
            const hashedPassword = bcryptjs.hashSync(newPassword, salt);
            
            await User.findByIdAndUpdate(decoded.userId, { password: hashedPassword });
        
            res.status(200).send("Contraseña actualizada exitosamente.");
          } catch (error) {
            res.status(400).send("Token inválido o expirado.");
          }
    },
    putActivarUsuario: async (req, res) => {
        try {
            const id = req.params.id.trim();
            await Usuario.findByIdAndUpdate(id, { estado: 1 });
            res.json({ msg: "Usuario Activado" });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    putDesactivarUsuario: async (req, res) => {
        try {
            const id = req.params.id.trim();
            await Usuario.findByIdAndUpdate(id, { estado: 0 });
            res.json({ msg: "Usuario Desactivado" });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
};

module.exports = { httpUsuario };
