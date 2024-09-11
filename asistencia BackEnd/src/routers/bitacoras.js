const express = require('express')
const { httpBitacora } = require('./../controllers/bitacoras.js')
const { bitacoraHelpers } = require("./../helpers/bitacoras.js")
const routerBitacora = express.Router()
const { check } = require('express-validator');
const { validarCampos } = require('./../middlewares/validar-campos.js');
const { validarJWT } = require('./../middlewares/validarJWT.js');

//GET
routerBitacora.get('/listarTodo', [
    validarJWT,
    validarCampos
], httpBitacora.getListarBitacoras)
routerBitacora.get('/listarPorEstado', [
    validarJWT,
    validarCampos
], httpBitacora.getListarBitacorasPorEstado)
routerBitacora.get('/listarPorAprendiz/:aprendiz', [
    validarJWT,
    check('aprendiz', 'El aprendiz es obligatorio').notEmpty().isMongoId(),
    check('aprendiz').custom(bitacoraHelpers.validarAprendiz),
    validarCampos
], httpBitacora.getListarPorAprendiz)
routerBitacora.get('/listarPorFicha/:ficha', [
    validarJWT,
    validarCampos
], httpBitacora.getListarPorFicha)

//POST
routerBitacora.post('/crear1', [
    validarJWT,
    check('aprendiz', 'El aprendiz es obligatorio').notEmpty(),
    check('aprendiz', 'El aprendiz debe ser un MongoId').isMongoId(),
    check('fecha', 'La fecha es obligatoria').notEmpty(),
    check('aprendiz').custom(bitacoraHelpers.validarAprendiz1),
    check('estado').optional().custom(bitacoraHelpers.validarEstado),
    validarCampos
], httpBitacora.postCrearBitacora1)
routerBitacora.post('/crear2', [
    // validarJWT,
    check('cedula', 'El aprendiz es obligatorio').notEmpty(),
    // check('cedula', 'El aprendiz debe ser un MongoId').isMongoId(),
    check('fecha', 'La fecha es obligatoria').notEmpty(),
    check('cedula').custom(bitacoraHelpers.validarAprendiz2),
    check('estado').optional().custom(bitacoraHelpers.validarEstado),
    validarCampos
], httpBitacora.postCrearBitacora2)

//PUT
routerBitacora.put('/modificar/:id', [
    validarJWT,
    check('id', 'El id es obligatorio').notEmpty(),
    check('id', 'El id debe ser MongoId').isMongoId(),
    check('id').custom(bitacoraHelpers.validarId),
    check('estado').custom(bitacoraHelpers.validarEstado),
    validarCampos
], httpBitacora.putModificarBitacoraEstado)

module.exports = routerBitacora