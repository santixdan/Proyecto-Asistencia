const mongoose = require('mongoose');
const moment = require('moment-timezone');

const bitacoraSchema = new mongoose.Schema({
    aprendiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Aprendiz' },
    fecha: { type: Date, },
    estado: {type: String, default: "Pendiente", enum: ["Asistió", "No asistió", "Excusa", "Pendiente"]}
}, { timestamps: true })

module.exports = mongoose.model("Bitacora", bitacoraSchema)