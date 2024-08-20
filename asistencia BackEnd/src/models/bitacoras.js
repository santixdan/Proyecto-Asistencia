const mongoose = require('mongoose');

const bitacoraSchema = new mongoose.Schema({
    aprendiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Aprendiz' },
    fecha: { type: Date, default: Date.now() }
}, { timestamps: true })

module.exports = mongoose.model("Bitacora", bitacoraSchema)