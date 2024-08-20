// const express = require('express');
// const mongoose = require('mongoose');
// const routerAprendiz = require('./src/routers/aprendices.js');
// const routerFicha = require('./src/routers/fichas');
// const routerUsuario = require('./src/routers/usuarios');
// const routerBitacora = require('./src/routers/bitacoras');
// require('dotenv').config()



// const app = express()

// app.use(express.json())
// app.use('/aprendices', routerAprendiz)
// app.use('/fichas', routerFicha)
// app.use('/usuarios', routerUsuario)
// app.use('/bitacoras', routerBitacora)

// app.listen(process.env.PORT, () => {
//     console.log(`El servidor está funcionando en el puerto ${process.env.PORT}`);
//     mongoose.connect('mongodb://127.0.0.1:27017/asistencia').then(() => console.log('Connected!'))
// });
const Server = require('./src/models/server')
require('dotenv').config()

const server = new Server()

server.listen();