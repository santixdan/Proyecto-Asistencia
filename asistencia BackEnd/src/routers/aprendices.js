const express = require('express');
const { httpAprendices } = require('./../controllers/aprendices.js');
const { apredizHelpers } = require("./../helpers/aprendices.js")
const routerAprendiz = express.Router();
const { check } = require('express-validator');
const { validarCampos } = require('./../middlewares/validar-campos.js');
const { validarJWT } = require('./../middlewares/validarJWT.js');

//GET
routerAprendiz.get("/listarTodo", [
    validarJWT,
    validarCampos
], httpAprendices.getListarAprendiz)
routerAprendiz.get("/listarPorFicha/:ficha", [
    validarJWT,
    check('ficha', 'La ficha es obligatoria').notEmpty().isMongoId(),
    check('ficha').custom(apredizHelpers.validarFicha),
    validarCampos
], httpAprendices.getListarPorFichaAprendiz)
routerAprendiz.get("/listarPorId/:id", [
    validarJWT,
    check('id', 'El id no es válido').notEmpty().isMongoId(),
    check('id').custom(apredizHelpers.validarId),
    validarCampos
], httpAprendices.getListarPorIdAprendiz)

//POST
routerAprendiz.post("/crear", [
    validarJWT,
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('cedula', 'La cédula es obligatoria').notEmpty().isLength({ min: 8 }),
    check('cedula', 'La cédula debe tener mínimo 8 caracteres').isLength({ min: 8 }),
    check('cedula').custom(apredizHelpers.validarCedulaAprendiz),
    check('ficha', 'La ficha es obligatoria').notEmpty().isMongoId(),
    check('ficha', 'La ficha debe ser MongoId').isMongoId(),
    check('ficha').custom(apredizHelpers.validarFicha),
    check('telefono', 'El teléfono es obligatorio').notEmpty().isMobilePhone(),
    check('telefono', 'El teléfono debe ser válido').isMobilePhone(),
    check('telefono').custom(apredizHelpers.validarTelefonoAprendiz),
    check('email', 'El correo es obligatorio').notEmpty().isEmail(),
    check('email', 'El correo debe ser válido').notEmpty().isEmail(),
    check('email').custom(apredizHelpers.validarEmailAprendiz),
    validarCampos
], httpAprendices.postCrearAprendiz)

//PUT
routerAprendiz.put("/modificar/:id", [
    validarJWT,
    check('id', 'El id no es válido').notEmpty().isMongoId(),
    check('id').custom(apredizHelpers.validarId),
    check('cedula', 'La cédula debe tener mínimo 8 caracteres').optional().isLength({ min: 8 }),
    check('cedula').optional().custom(apredizHelpers.validarCedulaAprendiz),
    check('ficha', 'La ficha debe ser mongoId').optional().isMongoId(),
    check('ficha').optional().custom(apredizHelpers.validarFicha),
    check('telefono', 'El teléfono debe ser válido').optional().isMobilePhone(),
    check('telefono').optional().custom(apredizHelpers.validarTelefonoAprendiz),
    check('email', 'El correo debe ser válido').optional().isEmail(),
    check('email').optional().custom(apredizHelpers.validarEmailAprendiz),
    validarCampos
], httpAprendices.putModificarAprendiz)
routerAprendiz.put("/activar/:id", [
    validarJWT,
    check('id', 'El id no es válido').notEmpty().isMongoId(),
    check('id').custom(apredizHelpers.validarId),
    validarCampos
], httpAprendices.putActivarAprendiz)
routerAprendiz.put("/desactivar/:id", [
    validarJWT,
    check('id', 'El id no es válido').notEmpty().isMongoId(),
    check('id').custom(apredizHelpers.validarId),
    validarCampos
], httpAprendices.putDesactivarAprendiz)

module.exports = routerAprendiz