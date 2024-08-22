const Bitacora = require("./../models/bitacoras.js")
const Aprendiz = require("./../models/aprendices.js")

const httpBitacora = {
    getListarBitacoras: async (req, res) => {
        try {
            const bitacoras = await Bitacora.find();
            res.json({ bitacoras });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    getListarPorAprendiz: async (req, res) => {
        try {
            const { startDate, endDate } = req.body;
            const aprendiz = req.params.aprendiz;
            const query = { aprendiz };
            if (startDate && endDate) {
                query.fecha = {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                };
            }
            const bitacora = await Bitacora.find(query);
            res.json({ bitacora });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    getListarPorFicha: async (req, res) => {
        try {
            const ficha = req.params.ficha;
            const aprendices = await Aprendiz.find({ ficha });
            res.json({ aprendices });
        } catch (error) {
            console.error("Error en getListarBitacorasPorFicha:", error);
            res.status(500).json({ error: error.message });
        }
    },
    postCrearBitacora: async (req, res) => {
        try {
            const { aprendiz, fecha } = req.body;
            const newBitacora = new Bitacora({ aprendiz, fecha })
            await newBitacora.save()
            res.json({ newBitacora })
        } catch (error) {
            res.status(400).json({ error })
        }
    },
    putModificarBitacora: async (req, res) => {
        try {
            const id = req.params.id;
            const { aprendiz, fecha } = req.body
            const bitacora = await Bitacora.findById(id)
            if (aprendiz) {
                bitacora.aprendiz = aprendiz
            }
            if (fecha) {
                bitacora.fecha = fecha
            }
            await bitacora.save()
            res.json({ bitacora })
        } catch (error) {
            res.status(400).json({ error })
        }
    }
}

module.exports = { httpBitacora }