const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT || 4000;
        this.paths = {
            aprendices: '/aprendices',
            bitacoras: '/bitacoras',
            fichas: '/fichas',
            usuarios: '/usuarios'
        };
        this.middlewares();
        this.routes();
    }
    middlewares() {
        this.app.use(express.json());
        this.app.use(cors())
    }
    routes() {
        this.app.use(this.paths.aprendices, require('./../routers/aprendices.js'));
        this.app.use(this.paths.bitacoras, require('./../routers/bitacoras.js'));
        this.app.use(this.paths.fichas, require('./../routers/fichas.js'));
        this.app.use(this.paths.usuarios, require('./../routers/usuarios.js'));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`El servidor está funcionando en el puerto ${this.port}`);
            mongoose.connect('mongodb://127.0.0.1:27017/asistencia').then(() => console.log('Connected!'))
        });
        
    }
}
module.exports = Server