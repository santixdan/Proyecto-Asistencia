const express = require('express');
const { httpFichas } = require('./../controllers/fichas.js');
const { fichaHelpers } = require("./../helpers/fichas.js")
const routerFicha = express.Router();
const { check } = require('express-validator');
const { validarCampos } = require('./../middlewares/validar-campos.js');
const { validarJWT } = require('./../middlewares/validarJWT.js');

//GET
routerFicha.get("/listarTodo", [
    validarJWT,
    validarCampos
], httpFichas.getListarFichas)

//POST
routerFicha.post("/crear", [
    validarJWT,
    check('nombre', 'El nombre es obligatorio y debe ser texto').notEmpty().isString(),
    check('codigo', 'El código es obligatorio y debe ser texto').notEmpty(),
    check('codigo', 'El código debe tener mínimo 5 caracteres').isLength({ min: 5 }),
    check('codigo').custom(fichaHelpers.validarCodigoFicha),
    validarCampos
], httpFichas.postCrearFichas)

//PUT
routerFicha.put("/modificar/:id", [
    validarJWT,
    check('id', 'El id es obligatorio').notEmpty(),
    check('id', 'El id debe ser MongoId').isMongoId(),
    check('id').custom(fichaHelpers.validarId),
    check('nombre', 'El nombre es obligatorio y debe ser texto').notEmpty().isString(),
    check('codigo', 'El codigo debe tener mínimo 5 caracteres').notEmpty().isLength({ min: 5 }),
    // check('codigo').custom(fichaHelpers.validarCodigoFicha),
    check('codigo').custom(async (codigo, { req }) => {
        await fichaHelpers.validarCodigoSiEsDiferente(codigo, req.params.id);
    }),
    validarCampos
], httpFichas.putModificarFichas)
routerFicha.put("/activar/:id", [
    validarJWT,
    check('id', 'El id es obligatorio').notEmpty(),
    check('id', 'El id debe ser MongoId').isMongoId(),
    check('id').custom(fichaHelpers.validarId),
    validarCampos
], httpFichas.putActivarFichas)
routerFicha.put("/desactivar/:id", [
    validarJWT,
    check('id', 'El id es obligatorio').notEmpty(),
    check('id', 'El id debe ser MongoId').isMongoId(),
    check('id').custom(fichaHelpers.validarId),
    validarCampos
], httpFichas.putDesactivarFichas)

module.exports = routerFicha