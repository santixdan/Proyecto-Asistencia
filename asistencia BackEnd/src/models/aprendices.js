const mongoose = require('mongoose');

const aprendizSchema = new mongoose.Schema({
    ficha: { type: mongoose.Schema.Types.ObjectId, ref: 'Ficha' },
    cedula: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    telefono: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    firma: { type: String },
    estado: { type: Number, default: 1, enum: [1, 0] }
}, { timestamps: true })

module.exports = mongoose.model("Aprendiz", aprendizSchema)