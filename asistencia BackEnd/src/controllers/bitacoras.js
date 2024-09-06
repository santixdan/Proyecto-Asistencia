const Bitacora = require("./../models/bitacoras.js")
const Aprendiz = require("./../models/aprendices.js")

const httpBitacora = {
    getListarBitacoras: async (req, res) => {
        try {
            const bitacora = await Bitacora.find()
            res.json({ bitacora })
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    getListarBitacorasPorEstado: async (req, res) => {
        try {
            const bitacora = await Bitacora.find({estado : "Asistió"})
            res.json({ bitacora })
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    getListarPorAprendiz: async (req, res) => {
        try {
            const aprendiz = req.params.aprendiz
            const bitacora = await Bitacora.find({ aprendiz })
            res.json({ bitacora })
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    getListarPorFicha: async (req, res) => {
        const ficha = req.params.ficha;
        try {
            const aprendices = await Aprendiz.find({ ficha });

            if (aprendices.length === 0) {
                return res.json({ mensaje: "No hay aprendices para la ficha proporcionada" });
            }
            const aprendizIds = aprendices.map(aprendiz => aprendiz);
            res.json({aprendizIds});
        } catch (error) {
            console.error("Error en getListarBitacorasPorFicha:", error);
            res.status(500).json({ error: error.message });
        }
    },
    postCrearBitacora: async (req, res) => {
        try {
            const { aprendiz, fecha, estado } = req.body;
            const newBitacora = new Bitacora({ aprendiz, fecha, estado })
            await newBitacora.save()
            res.json({ newBitacora })
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    putModificarBitacoraEstado: async (req, res) => {
        try {
            const id = req.params.id;
            const { estado } = req.body
            const bitacora = await Bitacora.findByIdAndUpdate(id, {estado})
            res.json({ bitacora })
        } catch (error) {
            res.status(400).json({ error })
        }
    }
}

module.exports = { httpBitacora }