const Url = require('../models/Url');
const { nanoid } = require('nanoid');

const leerUrls = async (req, res) => {
    try {
        const urls = await Url.find({ user: req.user.id }).lean();
        res.render('home', { urls: urls });
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/');
    }
}

const agregarUrl = async (req, res) => {
    const { origin } = req.body
    try {
        if(!(await Url.find({origin: origin, user: req.user.id }).lean()).length == 0) {
            throw new Error("Ya tiene registrada esa URL")
        }
        const url = new Url({ origin: origin, shortURL: nanoid(8), user: req.user.id });
        console.log(req.user.type);
        await url.save();
        res.redirect('/');
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/');
    }
}

const eliminarUrl = async (req, res) => {
    try {
        // await Url.findOneAndDelete(req.params.id)
        const url = await Url.findById(req.params.id);
        if (!url.user.equals(req.user.id)) {
            throw new Error("No te pertenece esta URL");
        }
        await url.remove();
        req.flash('mensajes', [{ msg: "URL eliminada"}]);
        res.redirect('/');
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/');
    }
}

const editarUrlForm = async (req, res) => {
    const { id } = req.params;
    try {
        const url = await Url.findById(id).lean();

        if (!url.user.equals(req.user.id)) {
            throw new Error("No te pertenece esta URL");
        }

        res.render('home', { url });
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/');
    }
}

const editarUrl = async (req, res) => {
    const { id } = req.params;
    const { origin } = req.body;
    try {

        const url = await Url.findById(req.params.id);
        if (!url.user.equals(req.user.id)) {
            throw new Error("No te pertenece esta URL");
        }

        await url.updateOne({origin});
        req.flash('mensajes', [{ msg: "URL editada"}]);
        // await Url.findByIdAndUpdate(id, { origin });
        res.redirect('/');
    } catch (error) {
        req.flash('mensajes', [{ msg: error.message }]);
        return res.redirect('/');
    }
}

const redireccionamiento = async (req, res) => {
    console.log("hola");
    const { shortURL } = req.params;
    try {
        const urlBD = await Url.findOne({ shortURL: shortURL });
        res.redirect(urlBD.origin);
    } catch (error) {
        req.flash('mensajes', [{ msg: "URL no configurada" }]);
        return res.redirect('/');
    }
}

module.exports = {
    leerUrls,
    agregarUrl,
    eliminarUrl,
    editarUrlForm,
    editarUrl,
    redireccionamiento,
}