const mongoose = require('mongoose');

const bitacoraSchema = new mongoose.Schema({
    aprendiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Aprendiz' },
    fecha: { type: Date, required: true },
    estado: {type: String, default: "Pendiente", enum: ["Asistió", "No asistió", "Excusa", "Pendiente"]}
}, { timestamps: true })

module.exports = mongoose.model("Bitacora", bitacoraSchema)