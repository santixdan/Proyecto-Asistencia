const Usuario = require("./../models/usuarios.js");
const jwt = require('jsonwebtoken');
const bcryptjs = require("bcryptjs");
const nodemailer = require("nodemailer")
const { generarJWT } = require("../middlewares/validarJWT");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.CORREO,
        pass: process.env.PASSWORD
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
    postCrearUsuarios: async (req, res) => {
        try {
            const { email, password, nombre } = req.body

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
            const { email, password } = req.body
            const usuario = await Usuario.findOne({ email });
            const token = await generarJWT(usuario._id);
            res.json({ usuario, token });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    postEnviarEmail: async (req, res) => {

        try {
            const email = req.body.email.trim();
            const user = await Usuario.findOne({ email })
            const token = jwt.sign({ userId: user._id }, process.env.SECRETORPRIVATEKEY, { expiresIn: "1h" });
            const resetLink = `https://proyecto-asistencia-cxfa.onrender.com/#/recuperar/${token}`
            const mailOptions = {
                from: process.env.CORREO,
                to: email,
                subject: "Restablecimiento de contraseña",
                // text: `Haz clic en el siguiente enlace para restablecer tu contraseña: ${resetLink}`
                html: `
                <html>
                    <head>
                        <style>
                            body {
                                font-family: Arial, sans-serif;
                                background-color: #f4f4f9;
                                margin: 0;
                                padding: 0;
                            }
                            .container {
                                width: 100%;
                                padding: 20px;
                                text-align: center;
                            }
                            .card {
                                background-color: white;
                                padding: 30px;
                                border-radius: 10px;
                                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                width: 90%;
                                max-width: 500px;
                                margin: 0 auto;
                            }
                            .btn {
                                background-color: #4CAF50;
                                color: white;
                                padding: 10px 20px;
                                border-radius: 5px;
                                text-decoration: none;
                                font-weight: bold;
                            }
                            .footer {
                                font-size: 12px;
                                color: #555;
                                margin-top: 20px;
                            }
                        </style>
                    </head>
                    <body>
                        <div class="container">
                            <div class="card">
                                <h2>Restablecimiento de Contraseña</h2>
                                <p>Hola, ${user.nombre}</p>
                                <p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p>
                                <a href="${resetLink}" class="btn">Restablecer Contraseña</a>
                                <p class="footer">Si no solicitaste este cambio, ignora este correo.</p>
                            </div>
                        </div>
                    </body>
                </html>
            `
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return res.status(400).json({ error });
                }
                res.json({ msg: "Correo electrónico enviado." });
            });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    putModificarUsuarios: async (req, res) => {
        try {
            const id = req.params.id.trim();
            const email = req.body.email?.trim();
            const nombre = req.body.nombre?.trim();

            const usuario = await Usuario.findById(id);

            if (email) usuario.email = email;
            if (nombre) usuario.nombre = nombre;

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
        try {
            const token = req.body.token.trim();
            const newPassword = req.body.newPassword.trim();

            const decoded = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
            const salt = bcryptjs.genSaltSync();
            const hashedPassword = bcryptjs.hashSync(newPassword, salt);

            await Usuario.findByIdAndUpdate(decoded.userId, { password: hashedPassword });

            res.status(200).json({ msg: "Contraseña actualizada exitosamente." });
        } catch (error) {
            res.status(400).json({ error });
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