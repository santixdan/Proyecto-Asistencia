const mongoose = require('mongoose');

const usuarioSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    nombre: { type: String, required: true },
    estado: { type: Number, default: 1, enum: [1, 0] }
}, { timestamps: true })

module.exports = mongoose.model("Usuario", usuarioSchema)