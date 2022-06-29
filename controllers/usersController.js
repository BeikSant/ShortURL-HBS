const User = require('../models/User');

const obtenerUsuarios = async (req, res) => {
    try {
        const users = (req.query.Search) ?
            await User.find({userName: {$regex: req.query.Search}}).sort({ userName: 1 }).lean() :
            await User.find().sort({ userName: 1 }).lean();
        res.render('adminUser', { users: users });
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/');
    }
}

const bloquearUsuario = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) throw new Error('Usuario no registrado');
        if (!user.blockedAccount) {
            user.blockedAccount = true;
        }
        await user.save();
        req.flash('mensajes', [{ msg: "Usuario Bloqueado" }]);
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
    }
    return res.redirect('/admin/users?Search');
}

const desbloquearUsuario = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) throw new Error('Usuario no registrado');
        if (user.blockedAccount) {
            user.blockedAccount = false;
        }
        await user.save();
        req.flash('mensajes', [{ msg: "Usuario Desbloqueado" }]);
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
    }
    return res.redirect('/admin/users?Search');
}

const acreditarRol = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) throw new Error('Usuario no registrado');
        if (user.type == "user") {
            user.type = "admin";
        }
        await user.save();
        req.flash('mensajes', [{ msg: "Rol Mejorado" }]);
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
    }
    return res.redirect('/admin/users');
}


const desacreditarRol = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) throw new Error('Rol Quitado');
        if (user.type == "admin") {
            user.type = "user";
        }
        await user.save();
        req.flash('mensajes', [{ msg: "Rol Desacreditado" }]);
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
    }
    return res.redirect('/admin/users');
}


module.exports = {
    obtenerUsuarios,
    bloquearUsuario,
    desbloquearUsuario,
    acreditarRol,
    desacreditarRol,
}