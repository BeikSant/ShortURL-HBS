const User = require('../models/User');

const obtenerUsuarios = async (req, res) => {
    try {
        const users = await User.find().sort({userName: 1}).lean();
        res.render('adminUser', { users: users });
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/');
    }
}

module.exports = {
    obtenerUsuarios,
}