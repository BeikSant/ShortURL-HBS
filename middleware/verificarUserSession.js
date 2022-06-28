const verificarUser = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/login');
}

const isAdmin = (req, res, next) => {
    if (req.user.isAdmin) {
        return next();
    }
    req.flash('mensajes', [{ msg: "URL no configurada" }]);
    res.redirect('/');
}


module.exports = {
    verificarUser,
    isAdmin,
}
