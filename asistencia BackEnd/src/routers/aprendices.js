const express = require('express');
const { httpAprendices, upload  } = require('./../controllers/aprendices.js');
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
    upload.single('firma'),
    check('nombre', 'El nombre es obligatorio y debe ser texto').notEmpty().isString(),
    check('cedula', 'La cédula es obligatoria').notEmpty(),
    check('cedula', 'La cédula debe tener mínimo 8 caracteres').isLength({ min: 8 }),
    check('cedula').custom(apredizHelpers.validarCedulaAprendiz),
    check('ficha', 'La ficha es obligatoria').notEmpty(),
    check('ficha', 'La ficha debe ser MongoId').isMongoId(),
    check('ficha').custom(apredizHelpers.validarFicha),
    check('ficha').custom(apredizHelpers.validarFichaActiva),
    check('telefono', 'El teléfono es obligatorio').notEmpty(),
    check('telefono', 'El teléfono debe ser válido').isMobilePhone(),
    check('telefono').custom(apredizHelpers.validarTelefonoAprendiz),
    check('email', 'El correo es obligatorio').notEmpty(),
    check('email', 'El correo debe ser válido').isEmail(),
    check('email').custom(apredizHelpers.validarEmailAprendiz),
    validarCampos,
    
], httpAprendices.postCrearAprendiz);

//PUT
routerAprendiz.put("/modificar/:id", [
    validarJWT,
    upload.single('firma'),
    check('id', 'El id es obligatorio').notEmpty(),
    check('id', 'El id debe ser MongoId').isMongoId(),
    check('id').custom(apredizHelpers.validarId),
    check('nombre', 'El nombre es obligatorio y debe ser texto').notEmpty().isString(),
    check('cedula', 'La cédula debe tener mínimo 8 caracteres').notEmpty().isLength({ min: 8 }),
    // check('cedula').custom(apredizHelpers.validarCedulaAprendiz),
    check('cedula').custom(async (cedula, { req }) => {
        await apredizHelpers.validarCedulaSiEsDiferente(cedula, req.params.id);
    }),
    check('ficha', 'La ficha debe ser mongoId').notEmpty().isMongoId(),
    check('ficha').custom(apredizHelpers.validarFicha),
    check('ficha').custom(apredizHelpers.validarFichaActiva),
    check('telefono', 'El teléfono debe ser válido').notEmpty().isMobilePhone(),
    // check('telefono').custom(apredizHelpers.validarTelefonoAprendiz),
    check('telefono').custom(async (telefono, { req }) => {
        await apredizHelpers.validarTelefonoSiEsDiferente(telefono, req.params.id);
    }),
    check('email', 'El correo debe ser válido').notEmpty().isEmail(),
    // check('email').custom(apredizHelpers.validarEmailAprendiz),
    check('email').custom(async (email, { req }) => {
        await apredizHelpers.validarEmailSiEsDiferente(email, req.params.id);
    }),
    validarCampos
], httpAprendices.putModificarAprendiz)
routerAprendiz.put("/activar/:id", [
    validarJWT,
    check('id', 'El id es obligatorio').notEmpty(),
    check('id', 'El id debe ser MongoId').isMongoId(),
    check('id').custom(apredizHelpers.validarId),
    validarCampos
], httpAprendices.putActivarAprendiz)
routerAprendiz.put("/desactivar/:id", [
    validarJWT,
    check('id', 'El id es obligatorio').notEmpty(),
    check('id', 'El id debe ser MongoId').isMongoId(),
    check('id').custom(apredizHelpers.validarId),
    validarCampos
], httpAprendices.putDesactivarAprendiz)

module.exports = routerAprendiz