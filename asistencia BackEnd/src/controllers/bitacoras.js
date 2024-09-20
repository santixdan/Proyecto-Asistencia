const Bitacora = require("./../models/bitacoras.js");
const Aprendiz = require("./../models/aprendices.js");

const httpBitacora = {
    getListarBitacoras: async (req, res) => {
        try {
            const bitacora = await Bitacora.find();
            console.log('Bitácoras encontradas:', bitacora.length);
            res.json({ bitacora });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    getListarBitacorasPorId: async (req, res) => {
        try {
            const id = req.params.id.trim();
            const bitacora = await Bitacora.findById(id);
            res.json({ bitacora });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    getListarBitacorasPorEstado: async (req, res) => {
        try {
            const bitacora = await Bitacora.find({ estado: "Asistió" });
            res.json({ bitacora });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    getListarPorAprendiz: async (req, res) => {
        try {
            const aprendiz = req.params.aprendiz.trim();
            const bitacora = await Bitacora.find({ aprendiz });
            res.json({ bitacora });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    getListarPorFicha: async (req, res) => {
        try {
            const ficha = req.params.ficha.trim();

            const aprendices = await Aprendiz.find({ ficha });
            const ids_Aprendiz = aprendices.map(aprendiz => aprendiz._id);
            const bitacoras = await Bitacora.find({ aprendiz: { $in: ids_Aprendiz } });

            res.json({ bitacoras });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    getListarPorFecha: async (req, res) => {
        try {
            const { fechaInicio, fechaFin } = req.body;
            const bitacoras = await Bitacora.find({ fecha: { $gte: fechaInicio, $lte: fechaFin } }).sort({ fecha: 1 });
            res.json({ bitacoras });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    getListarPorFechaYFicha: async (req, res) => {
        try {
            const ficha = req.params.ficha
            const { fechaInicio, fechaFin } = req.query;
            const aprendices = await Aprendiz.find({ ficha });
            const ids_Aprendiz = aprendices.map(aprendiz => aprendiz._id);
            
            const bitacoras = await Bitacora.find({aprendiz : { $in: ids_Aprendiz },  fecha: { $gte: fechaInicio, $lte: fechaFin } });
            res.json({ bitacoras });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    getListarPorFechaYFichaYEstado: async (req, res) => {
        try {
            const ficha = req.params.ficha
            const { fechaInicio, fechaFin } = req.query;
            const aprendices = await Aprendiz.find({ ficha });
            const ids_Aprendiz = aprendices.map(aprendiz => aprendiz._id);
            
            const bitacoras = await Bitacora.find({aprendiz : { $in: ids_Aprendiz },  fecha: { $gte: fechaInicio, $lte: fechaFin }, estado: 'Asistió' });
            res.json({ bitacoras });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    postCrearBitacora1: async (req, res) => {
        try {
            const aprendiz = req.body.aprendiz.trim();
            const fecha = req.body.fecha.trim();
            const estado = req.body.estado

            const newBitacora = new Bitacora({ aprendiz, fecha, estado });
            await newBitacora.save();
            res.json({ newBitacora });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    postCrearBitacora2: async (req, res) => {
        try {
            const cedula = req.body.cedula.trim();
            const fecha = req.body.fecha.trim();
            const estado = req.body.estado;

            const theAprendiz = await Aprendiz.findOne({ cedula });
            const newBitacora = new Bitacora({ aprendiz: theAprendiz._id, fecha, estado });
            await newBitacora.save();
            res.json({ newBitacora });

        } catch (error) {
            res.status(400).json({ error });
        }
    },
    putModificarBitacoraEstado: async (req, res) => {
        try {
            const id = req.params.id;
            const estado = req.body.estado.trim();

            const bitacora = await Bitacora.findByIdAndUpdate(id, { estado });
            res.json({ bitacora });
        } catch (error) {
            res.status(400).json({ error });
        }
    }
};

module.exports = { httpBitacora };
