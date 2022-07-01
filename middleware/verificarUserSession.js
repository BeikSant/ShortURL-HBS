const verificarUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.blocked) {
            return res.redirect('/auth/blocked');
        }
        return next();
    }
    res.redirect('/auth/login');
}

const verificarSession = (req, res, next) => {
    if (req.isAuthenticated()) {
        if (req.user.blocked) {
            return next();
        }
    }
    res.redirect('/');
}

const isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        return next();
    }
    req.flash('mensajes', [{ msg: "No Posee Permisos de Administrador" }]);
    res.redirect('/');
}

const verificarSessionReg = (req, res, next) => {
    if (req.isAuthenticated()) {
        req.logout(req.user, err => {
            if (err) return next(err);
        });
        return res.redirect('/auth/register');
    }
    return next();
}

const verificarSessionLogin = (req, res, next) => {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    return next();
}

module.exports = {
    verificarUser,
    isAdmin,
    verificarSessionReg,
    verificarSessionLogin,
    verificarSession,
}
