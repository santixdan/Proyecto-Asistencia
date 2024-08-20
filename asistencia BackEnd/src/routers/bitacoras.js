const express = require('express')
const { httpBitacora } = require('./../controllers/bitacoras.js')
const { bitacoraHelpers } = require("./../helpers/bitacoras.js")
const routerBitacora = express.Router()
const { check } = require('express-validator');
const { validarCampos } = require('./../middlewares/validar-campos.js');
const { validarJWT } = require('./../middlewares/validarJWT.js');

//GET
routerBitacora.get('/listarTodo', [
    // validarJWT,
    validarCampos
], httpBitacora.getListarBitacoras)
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
routerBitacora.post('/crear', [
    validarJWT,
    check('aprendiz', 'El aprendiz es obligatorio').notEmpty().isMongoId(),
    check('fecha', 'La fecha debe ser válida').optional().isDate(),
    check('aprendiz').custom(bitacoraHelpers.validarAprendiz),
    validarCampos
], httpBitacora.postCrearBitacora)

//PUT
routerBitacora.put('/modificar/:id', [
    validarJWT,
    check('id', 'El id no es válido').notEmpty().isMongoId(),
    check('id').custom(bitacoraHelpers.validarId),
    check('aprendiz', 'El Id debe ser válido').optional().isMongoId(),
    check('aprendiz').optional().custom(bitacoraHelpers.validarAprendiz),
    check('fecha', 'La fecha debe ser válida').optional().isDate(),
    validarCampos
], httpBitacora.putModificarBitacora)

module.exports = routerBitacora