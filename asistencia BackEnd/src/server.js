const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const nodemailer = require('nodemailer');

class Server {
    constructor() {
        this.app = express();
        this.port = process.env.PORT;
        this.mongo_uri = process.env.MONGO_URI
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
        this.app.use(express.urlencoded({ extended: true }));
        this.app.use(express.json());
        this.app.use(cors({
            origin: [
                'https://proyecto-asistencia-cxfa.onrender.com',
                'http://localhost:5173'
            ],
            credentials: true,
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
            allowedHeaders: ['Content-Type', 'Authorization', 'token', 'Accept', 'X-Requested-With']
        }));
        this.app.use(express.static('public'));
        // this.app.use(nodemailer());
    }
    routes() {
        this.app.use(this.paths.aprendices, require('./routers/aprendices.js'));
        this.app.use(this.paths.bitacoras, require('./routers/bitacoras.js'));
        this.app.use(this.paths.fichas, require('./routers/fichas.js'));
        this.app.use(this.paths.usuarios, require('./routers/usuarios.js'));
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log(`El servidor está funcionando en el puerto ${this.port}`);
            // mongoose.connect(this.mongo_uri).then(() => console.log('Connected!'))});
            mongoose.connect(this.mongo_uri).then(() => console.log('Connected!'))
                .catch((error) => console.error('Error de conexión a MongoDB:', error));
        });
    }
}
module.exports = Server