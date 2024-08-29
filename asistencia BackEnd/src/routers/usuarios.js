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
    check('email', 'El email es obligatorio').notEmpty().isEmail(),
    check('email', 'El email debe ser válido').isEmail(),
    check('email').custom(usuarioHelpers.validarEmailUsuario),
    check('nombre', 'El nombre es obligatorio').notEmpty(),
    check('password', 'La contraseña debe tener más de 5 caracteres').notEmpty(),
    check('password', 'La contraseña debe tener más de 5 caracteres').notEmpty().isLength({ min: 5 }),
    validarCampos
], httpUsuario.postCrearUsuarios)
routerUsuario.post('/login', [
    check('email', 'El email es obligatorio').notEmpty(),
    check('email', 'El email debe ser válido').isEmail(),
    check('password', 'La contraseña es obligatoria').notEmpty(),
    check('email').custom(async (email, { req }) => {
        await usuarioHelpers.validarPasswordUsuario(email, req.body.password);
    }),
    validarCampos
], httpUsuario.postLoginUsuario)

//PUT
routerUsuario.put("/modificar/:id", [
    validarJWT,
    check('id', 'El id no es válido').notEmpty().isMongoId(),
    check('id').custom(usuarioHelpers.validarId),
    check('email', 'El email debe ser válido').optional().isEmail(),
    check('email').optional().custom(usuarioHelpers.validarEmailUsuario),
    validarCampos
], httpUsuario.putModificarUsuarios)
routerUsuario.put("/activar/:id", [
    validarJWT,
    check('id', 'El id no es válido').notEmpty().isMongoId(),
    check('id').custom(usuarioHelpers.validarId),
    validarCampos
], httpUsuario.putActivarUsuario)
routerUsuario.put("/desactivar/:id", [
    validarJWT,
    check('id', 'El id no es válido').notEmpty().isMongoId(),
    check('id').custom(usuarioHelpers.validarId),
    validarCampos
], httpUsuario.putDesactivarUsuario)

module.exports = routerUsuario