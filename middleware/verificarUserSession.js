const verificarUser = (req, res, next) => {
    if (req.isAuthenticated()) {
            if (req.user.blocked){
                req.flash('mensajes', [{ msg: "Tu cuenta ha sido bloqueada" }]);
                return res.redirect('/auth/login');
            }
        return next();
    } else 
    res.redirect('/auth/login');
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
    verificarSessionLogin
}
