const express = require('express');
const { httpUsuario } = require('./../controllers/usuarios');
const { usuarioHelpers } = require("./../helpers/usuarios.js")
const routerUsuario = express.Router();
const { check } = require('express-validator');
const { validarCampos } = require('./../middlewares/validar-campos.js');
const { validarJWT } = require('./../middlewares/validarJWT.js');

//GET
routerUsuario.get("/listarTodos", [
    validarJWT,
    validarCampos
], httpUsuario.getListarUsuarios)

//POST
routerUsuario.post("/crear", [
    validarJWT,
    check('email', 'El email es obligatorio').notEmpty(),
    check('email', 'El email debe ser válido').isEmail(),
    check('email').custom(usuarioHelpers.validarEmailUsuario),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('password', 'La contraseña debe tener más de 5 caracteres').isLength({ min: 5 }),
    validarCampos
], httpUsuario.postCrearUsuarios)
routerUsuario.post('/login', [
    check('email', 'El email es obligatorio').notEmpty(),
    check('email').custom(usuarioHelpers.validarUsuarioActivo),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('email').custom(async (email, { req }) => {
        await usuarioHelpers.validarPasswordUsuario(email, req.body.password);
    }),
    validarCampos
], httpUsuario.postLoginUsuario)

//PUT
routerUsuario.put("/modificar/:id", [
    validarJWT,
    check('id', 'El id es obligatorio').notEmpty(),
    check('id', 'El id debe ser MongoId').isMongoId(),
    check('id').custom(usuarioHelpers.validarId),
    check('email', 'El email debe ser válido').optional().isEmail(),
    check('email').optional().custom(async (email, { req }) => {
        await usuarioHelpers.validarEmailSiEsDiferente(email, req.params.id);
    }),
    validarCampos
], httpUsuario.putModificarUsuarios)
routerUsuario.put("/modificarPassword", [
    check('email', 'El email es obligatorio').notEmpty(),
    check('email', 'El email debe ser válido').isEmail(),
    check('email').custom(usuarioHelpers.validarNoEmailUsuario),
    check('newPassword', 'La nueva contraseña es obligatoria').notEmpty(),
    check('confirmPassword', 'La confirmacion contraseña es obligatoria').notEmpty(),
    check('newPassword').custom(async (newPassword, { req }) => {
        await usuarioHelpers.validarNewPassword(newPassword, req.body.confirmPassword);
    }),
    validarCampos
], httpUsuario.putModificarPassword)
routerUsuario.put("/activar/:id", [
    validarJWT,
    check('id', 'El id es obligatorio').notEmpty(),
    check('id', 'El id debe ser MongoId').isMongoId(),
    check('id').custom(usuarioHelpers.validarId),
    validarCampos
], httpUsuario.putActivarUsuario)
routerUsuario.put("/desactivar/:id", [
    validarJWT,
    check('id', 'El id es obligatorio').notEmpty(),
    check('id', 'El id debe ser MongoId').isMongoId(),
    check('id').custom(usuarioHelpers.validarId),
    validarCampos
], httpUsuario.putDesactivarUsuario)

module.exports = routerUsuario