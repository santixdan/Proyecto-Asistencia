const Bitacora = require("./../models/bitacoras.js");
const Aprendiz = require("./../models/aprendices.js");

const httpBitacora = {
    getListarBitacoras: async (req, res) => {
        try {
            const bitacora = await Bitacora.find();
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
    getListarPorFichaYFecha: async (req, res) => {
        try {
            const ficha = req.params.ficha.trim();
            const { fecha } = req.query;

            console.log('Ficha:', ficha);
            console.log('Fecha:', fecha);

            const aprendices = await Aprendiz.find({ ficha });
            const ids_Aprendiz = aprendices.map(aprendiz => aprendiz._id);
            console.log('IDs de Aprendices:', ids_Aprendiz);

            // Buscar bitácoras directamente con el filtro de fecha
            const bitacoras = await Bitacora.find({
                aprendiz: { $in: ids_Aprendiz },
                fecha: new Date(fecha) // Asegúrate de que `fecha` esté en el formato correcto
            });

            console.log('Bitácoras encontradas:', bitacoras.length);

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
