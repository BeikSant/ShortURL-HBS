const express = require('express');
const { obtenerUsuarios } = require('../controllers/usersController');
const { verificarUser, isAdmin } = require('../middleware/verificarUserSession');

const router = express.Router();

router.get('/users', verificarUser, isAdmin, obtenerUsuarios);


module.exports = router;