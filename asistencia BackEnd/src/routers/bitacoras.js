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
routerBitacora.get('/listarPorId/:id', [
    validarJWT,
    check('id', 'El id no es válido').notEmpty().isMongoId(),
    check('id').custom(bitacoraHelpers.validarId),
    validarCampos
], httpBitacora.getListarBitacoras)
routerBitacora.get('/listarPorEstado', [
    validarJWT,
    validarCampos
], httpBitacora.getListarBitacorasPorEstado)
routerBitacora.get('/listarPorAprendiz/:aprendiz', [
    validarJWT,
    check('aprendiz', 'El aprendiz es obligatorio').notEmpty().isMongoId(),
    check('aprendiz').custom(bitacoraHelpers.validarAprendiz1),
    validarCampos
], httpBitacora.getListarPorAprendiz)
routerBitacora.get('/listarPorFicha/:ficha', [
    validarJWT,
    check('ficha', 'La ficha es obligatoria').notEmpty(),
    check('ficha', 'La ficha debe ser MongoId').isMongoId(),
    check('ficha').optional().custom(bitacoraHelpers.validarFicha),
    validarCampos
], httpBitacora.getListarPorFicha)
routerBitacora.get('/listarPorFecha', [
    validarJWT,
    check('fechaInicio', 'La fecha debe ser valida').notEmpty(),
    check('fechaFin', 'La fecha debe ser valida').notEmpty(),
    validarCampos
], httpBitacora.getListarPorFecha)
routerBitacora.get('/listarPorFechaYFicha/:ficha', [
    // validarJWT,
    check('ficha', 'La ficha es obligatoria').notEmpty(),
    check('ficha', 'La ficha debe ser MongoId').isMongoId(),
    check('ficha').optional().custom(bitacoraHelpers.validarFicha),
    check('fechaInicio', 'La fecha debe ser valida').notEmpty(),
    check('fechaFin', 'La fecha debe ser valida').notEmpty(),
    validarCampos
], httpBitacora.getListarPorFechaYFicha)
routerBitacora.get('/listarPorFechaYFichaYEstado/:ficha', [
    validarJWT,
    check('ficha', 'La ficha es obligatoria').notEmpty(),
    check('ficha', 'La ficha debe ser MongoId').isMongoId(),
    check('ficha').optional().custom(bitacoraHelpers.validarFicha),
    check('fechaInicio', 'La fecha debe ser valida').notEmpty(),
    check('fechaFin', 'La fecha debe ser valida').notEmpty(),
    validarCampos
], httpBitacora.getListarPorFechaYFichaYEstado)


//POST
routerBitacora.post('/crear1', [
    validarJWT,
    check('aprendiz', 'El aprendiz es obligatorio').notEmpty(),
    check('aprendiz', 'El aprendiz debe ser un MongoId').isMongoId(),
    check('fecha', 'La fecha debe ser valida').notEmpty().isDate(),
    check('aprendiz').custom(bitacoraHelpers.validarAprendiz1),
    check('aprendiz').custom(bitacoraHelpers.validarAprendizActivo1),
    check('fecha').custom(async (fecha, { req }) => {
        await bitacoraHelpers.validarFecha1(fecha, req.body.aprendiz);
    }),
    check('estado').optional().custom(bitacoraHelpers.validarEstado),
    validarCampos
], httpBitacora.postCrearBitacora1)
routerBitacora.post('/crear2', [
    check('cedula', 'El aprendiz es obligatorio').notEmpty(),
    check('fecha', 'La fecha debe ser valida').notEmpty(),
    check('cedula').custom(bitacoraHelpers.validarAprendiz2),
    check('cedula').custom(bitacoraHelpers.validarAprendizActivo2),
    check('fecha').custom(async (fecha, { req }) => {
        await bitacoraHelpers.validarFecha2(fecha, req.body.cedula);
    }),
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