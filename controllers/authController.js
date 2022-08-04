const User = require("../models/User");
const { nanoid } = require('nanoid');
const { validationResult } = require('express-validator');
const { mailOptions, transporter } = require("../utils/mail");
const Forgout = require("../models/Forgout");


const registerForm = (req, res) => {
    res.render('register');
}

const loginForm = (req, res) => {
    res.render('login');
}

const formForgout = (req, res) => {
    res.render("forgout");
}

const formChangePassword = (req, res) => {
    res.render("changePass");
}

const registerUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('mensajes', errors.array());
        return res.redirect('/auth/register');
    }
    const { userName, email, password } = req.body;
    try {
        const duplicaUserName = await User.findOne({ userName: userName });
        const duplicateEmail = await User.findOne({ email: email });
        if (duplicaUserName) {
            throw new Error('El username ya esta siendo usado');
        } else if (duplicateEmail) {
            throw new Error('Correo ya registrado');
        }
        const tokenConfirm = nanoid();
        const user = new User({ userName, email, password, tokenConfirm });
        transporter.sendMail(mailOptions(email, tokenConfirm), (error, info) => {
            if (error) {
                console.log(error);
                throw new Error('No se logro enviar el correo');
            }
        });
        await user.save();

        req.flash('mensajes', [{ msg: "Revisa tu correo electrónico y valida tu cuenta" }]);
        res.redirect('/auth/login');

    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/auth/register');
    }
}

const confirmar = async (req, res) => {

    const { token } = req.params;
    try {
        const user = await User.findOne({ tokenConfirm: token })
        if (!user) throw new Error('No existe este usuario')
        user.confirmAccount = true;
        user.tokenConfirm = null;
        await user.save();
        req.flash('mensajes', [{ msg: "Cuenta verificada correctamente" }]);
        res.redirect('/auth/login');
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        res.redirect('/auth/login');
    }
}

const loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('mensajes', errors.array());
        return res.redirect('/auth/login');
    }
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email: email });
        if (!user) throw new Error('Usuario no registrado');
        if (!user.confirmAccount) throw new Error('Falta confirmar la cuenta');
        if (!(await user.comparePassword(password))) throw new Error('Contraseña incorrecta')

        //permite crear la sesion de usuario a traves de passport
        req.login(user, function (err) {
            if (err) throw new Error('Error al crear la sesion');
            return res.redirect('/');
        });
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/auth/login');
    }
}

const logout = (req, res) => {
    req.logout(req.user, err => {
        if (err) return next(err);
        res.redirect("/auth/login");
    });
}

const forgoutPassword = async (req, res) => {
    const email = req.body.email;
    console.log(req.body)
    try {
        const user = await User.findOne({ email: email });
        if (!user) throw new Error('Usuario no registrado');
        if (!user.confirmAccount) throw new Error('Falta confirmar la cuenta');

        const token = nanoid();
        const forgout = new Forgout({ token: token, user: user.id });
        await forgout.save();

        req.flash('mensajes', [{ msg: "Revisa tu correo electrónico" }]);
        res.redirect('/auth/login');
        //permite crear la sesion de usuario a traves de passport
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/auth/login');
    }
}

const formForgoutChangePassword = async (req, res) => {
    const { token } = req.params;
    try {
        const forgout = await Forgout.findOne({ token: token })
        if (!forgout) throw new Error('Solicitud no valida');
        if (!forgout.state) throw new Error('Solicitud no valida');
        return res.render('changePass',  { forgout: true, token: token });
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        res.redirect('/auth/login');
    }

}

const forgoutChangePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('mensajes', errors.array());
        return res.redirect('/auth/login');
    }
    const {token} = req.params;
    const newpassword = req.body.newpassword;
    try {
        const forgout = await Forgout.findOne({ token: token })
        if (!forgout) throw new Error('Solicitud no valida');

        const user = await User.findById(forgout.user);
        user.password = newpassword;
        console.log(user);
        await forgout.updateOne({state:false});
        await user.save();
        req.flash('mensajes', [{ msg: "Contraseña cambiada correctamente" }]);
        res.redirect('/auth/login');
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        res.redirect('/auth/login');
    }
}

const changePassword = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        req.flash('mensajes', errors.array());
        return res.redirect('/auth/changePassword');
    }
    const password = req.body.password;
    const newpassword = req.body.newpassword;
    try {
        const user = await User.findById(req.user.id);
        if (!(await user.comparePassword(password))) throw new Error('Contraseña incorrecta');
        if (password === newpassword) throw new Error('Escriba una contaseña diferente');
        user.password = newpassword;
        await user.save();
        req.flash('mensajes', [{ msg: "Contraseña cambiada correctamente" }]);
        res.redirect('/');
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        res.redirect('/auth/changePassword');
    }

const userBlocked = (req, res) => {
    res.render('Blocked');
}

module.exports = {
    loginForm,
    registerForm,
    registerUser,
    confirmar,
    loginUser,
    logout,
    formForgout,
    forgoutPassword,
    formForgoutChangePassword,
    forgoutChangePassword,
    formChangePassword,
    changePassword,
    userBlocked
}