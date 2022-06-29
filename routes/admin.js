const express = require('express');
const { obtenerUsuarios, bloquearUsuario, desbloquearUsuario, acreditarRol, desacreditarRol } = require('../controllers/usersController');
const { verificarUser, isAdmin } = require('../middleware/verificarUserSession');

const router = express.Router();

// router.get('/users',  obtenerUsuarios);
// router.get('/blockuser/:email', bloquearUsuario);
// router.get('/unblockuser/:email', desbloquearUsuario);
// router.get('/upgraderol/:email', acreditarRol);
// router.get('/ungraderol/:email', desacreditarRol);

router.get('/users', verificarUser, isAdmin, obtenerUsuarios);
router.get('/blockuser/:email', verificarUser, isAdmin, bloquearUsuario);
router.get('/unblockuser/:email', verificarUser, isAdmin, desbloquearUsuario);
router.get('/upgraderol/:email', verificarUser, isAdmin, acreditarRol);
router.get('/ungraderol/:email', verificarUser, isAdmin, desacreditarRol);


module.exports = router;