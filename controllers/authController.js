const User = require("../models/User");
const { nanoid } = require('nanoid');
const {validationResult} = require('express-validator');

const registerForm = (req, res) => {
    res.render('register');
}

const registerUser = async (req, res) => {
    const erorrs = validationResult(req);
    if (!erorrs.isEmpty()) return res.json(erorrs);

    console.log(req.body);
    const { userName, email, password } = req.body;
    try {
        const duplicaUserName = await User.findOne({ userName: userName });
        const duplicateEmail = await User.findOne({ email: email });
        if (duplicaUserName) {
            throw new Error('El UserName ya esta siendo usado');
        } else if (duplicateEmail) {
            throw new Error('Correo ya registrado');
        }
        const user = new User({ userName, email, password, tokenConfirm: nanoid() });
        await user.save();
        res.redirect('/auth/login')
    } catch (error) {
        res.json({ error: error.message });
    }
}

const confirmar = async (req, res) => {
    const { token } = req.params;
    try {
        const user = await User.findOne({tokenConfirm: token})
        if (!user) throw new Error('No existe este usuario')
        user.confirmAccount = true;
        user.tokenConfirm = null;
        await user.save();
        res.redirect('/auth/login');
    } catch (error) {
        res.json({ error: error.message });
    }
}

const loginForm = (req, res) => {
    res.render('login');
}

const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await User.findOne({email: email});
        if (!user) throw new Error('No registrado');
        if (!user.confirmAccount) throw new Error('Falta confirmar la cuenta');
        if (!(await user.comparePassword(password))) throw new Error('Contraseña incorrecta')
        res.redirect('/');
    } catch (error) {
        res.send(error.message);
    }
}
module.exports = {
    loginForm,
    registerForm,
    registerUser,
    confirmar,
    loginUser
}