const express = require('express');
const { body } = require('express-validator')
const { loginForm, registerForm, registerUser, confirmar, loginUser, logout } = require('../controllers/authController');
const { verificarSessionLogin, verificarSessionReg } = require('../middleware/verificarUserSession');
const router = express.Router();

router.get('/register', verificarSessionReg,registerForm);
router.post('/register',
    [
        body('userName', 'Ingrese un nombre valido').trim().notEmpty().escape(),
        body('email', 'Ingrese un email valido').trim().isEmail().normalizeEmail(),
        body('password', 'Ingrese de minimo 6 caracteres').trim().isLength({ min: 6 }).escape()
            .custom((value, { req }) => {
                if (value != req.body.repassword) {
                    throw new Error('No coinciden las contraseñas')
                } else {
                    return value;
                }
            }),
    ], registerUser)
router.get('/confirmar/:token', confirmar);
router.get('/login', verificarSessionLogin, loginForm);
router.post('/login', 
    [
        body('email', 'Ingrese un email valido').trim().isEmail().normalizeEmail(),
        body('password', 'Ingrese de minimo 6 caracteres').trim().isLength({ min: 6 }).escape(),
    ], loginUser);
router.get('/logout', logout);

module.exports = router;