const express = require('express');
const { loginForm, registerForm, registerUser, confirmar, loginUser } = require('../controllers/authController');
const router = express.Router();

router.get('/register', registerForm);
router.post('/register', registerUser);
router.get('/confirmar/:token', confirmar);
router.get('/login', loginForm);
router.post('/login', loginUser);

module.exports = router;