const mongoose = require('mongoose');

const fichaSchema = new mongoose.Schema({
    codigo: { type: String, required: true, unique: true },
    nombre: { type: String, required: true },
    estado: { type: Number, default: 1 }
}, { timestamps: true })


module.exports = mongoose.model("Ficha", fichaSchema)