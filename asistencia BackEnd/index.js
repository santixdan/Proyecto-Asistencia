const Server = require('./src/server.js')
require('dotenv').config()

const server = new Server()

server.listen();