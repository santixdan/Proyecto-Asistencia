const Ficha = require("./../models/fichas.js");

const httpFichas = {
    getListarFichas: async (req, res) => {
        try {
            const fichas = await Ficha.find();
            res.json({ fichas });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    postCrearFichas: async (req, res) => {
        try {
            const {codigo, nombre} = req.body
            const newFicha = new Ficha({ codigo, nombre });
            await newFicha.save();
            res.json({ newFicha });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    putModificarFichas: async (req, res) => {
        try {
            const id = req.params.id.trim();
            const {codigo, nombre} = req.body

            const ficha = await Ficha.findByIdAndUpdate(id, { codigo, nombre });
            res.json({ ficha });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    putActivarFichas: async (req, res) => {
        try {
            const id = req.params.id.trim();
            const ficha = await Ficha.findByIdAndUpdate(id, { estado: 1 });
            res.json({ msg: "Ficha Activada" });
        } catch (error) {
            res.status(400).json({ error });
        }
    },
    putDesactivarFichas: async (req, res) => {
        try {
            const id = req.params.id.trim();
            const ficha = await Ficha.findByIdAndUpdate(id, { estado: 0 });
            res.json({ msg: "Ficha Desactivada" });
        } catch (error) {
            res.status(400).json({ error });
        }
    }
};

module.exports = { httpFichas };
