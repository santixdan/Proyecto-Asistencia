const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

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
        this.app.use(express.json());
        this.app.use(cors({
            origin: 'https://frontend-domain.onrender.com',
            credentials: true
          }));
        this.app.use(express.static('public'));
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
            mongoose.connect(this.mongo_uri).then(() => console.log('Connected!'))
        });
        
    }
}
module.exports = Server