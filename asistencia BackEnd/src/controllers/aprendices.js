const Aprendiz = require("./../models/aprendices.js");
const Ficha = require("./../models/fichas.js");

const httpAprendices = {
    getListarAprendiz: async (req, res) => {
        try {
            const aprendices = await Aprendiz.find();
            res.json({ aprendices });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    getListarPorFichaAprendiz: async (req, res) => {
        try {
            const ficha = req.params.ficha.trim();
            const aprendiz = await Aprendiz.find({ ficha });
            res.json({ aprendiz });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    getListarPorIdAprendiz: async (req, res) => {
        try {
            const id = req.params.id.trim();
            const aprendiz = await Aprendiz.findById(id);
            if (aprendiz) {
                res.json({ aprendiz });
            }
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    postCrearAprendiz: async (req, res) => {
        try {
            const ficha = req.body.ficha.trim();      
            const cedula = req.body.cedula.trim();    
            const nombre = req.body.nombre.trim();    
            const telefono = req.body.telefono.trim();
            const email = req.body.email.trim();      
            
            const newAprendiz = new Aprendiz({ ficha, cedula, nombre, telefono, email });
            await newAprendiz.save();
            res.json({ newAprendiz });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    putModificarAprendiz: async (req, res) => {
        try {
            const id = req.params.id.trim();
            const ficha = req.body.ficha?.trim();      
            const cedula = req.body.cedula?.trim();    
            const nombre = req.body.nombre?.trim();    
            const telefono = req.body.telefono?.trim();
            const email = req.body.email?.trim();      

            const aprendiz = await Aprendiz.findById(id);

            if (ficha) aprendiz.ficha = ficha;
            if (cedula) aprendiz.cedula = cedula;
            if (nombre) aprendiz.nombre = nombre;
            if (telefono) aprendiz.telefono = telefono;
            if (email) aprendiz.email = email;

            await aprendiz.save();
            res.json({ aprendiz });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    putActivarAprendiz: async (req, res) => {
        try {
            const id = req.params.id.trim();
            const aprendiz = await Aprendiz.findByIdAndUpdate(id, { estado: 1 });
            res.json({ msg: "Aprendiz Activado" });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    putDesactivarAprendiz: async (req, res) => {
        try {
            const id = req.params.id.trim();
            const aprendiz = await Aprendiz.findByIdAndUpdate(id, { estado: 0 });
            res.json({ msg: "Aprendiz Desactivado" });
        } catch (error) {
            res.status(400).json({ error });
        }
    }
};

module.exports = { httpAprendices };
