const Url = require('../models/Url');
const { nanoid } = require('nanoid');

const leerUrls = async (req, res) => {
    try {
        const urls = await Url.find().lean();
        res.render('home', { urls: urls });
    } catch (error) {
        console.error(error);
        res.send('Fallo algo')
    }
}

const agregarUrl = async (req, res) => {
    const { origin } = req.body
    try {
        const url = new Url({ origin: origin, shortURL: nanoid(8) });
        await url.save();
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.send("Algo esta fallando");
    }
}

const eliminarUrl = async (req, res) => {
    try {
        await Url.findOneAndDelete(req.params.id)
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.send("Algo esta fallando");
    }
}

const editarUrlForm = async (req, res) => {
    const { id } = req.params;
    try {
        const url = await Url.findById(id).lean();
        res.render('home', { url });
    } catch (error) {
        console.log(error);
        res.send("Algo esta fallando");
    }
}

const editarUrl = async (req, res) => {
    const { id } = req.params;
    const { origin } = req.body;
    try {
        await Url.findByIdAndUpdate(id, { origin });
        res.redirect('/');
    } catch (error) {
        console.log(error);
        res.send("Algo esta fallando");
    }
}

const redireccionamiento = async (req, res) => {
    const { shortURL } = req.params;
    try {
        const urlBD = await Url.findOne({ shortURL: shortURL });
        res.redirect(urlBD.origin);
    } catch (error) {
        console.log(error);
        res.send("Algo esta fallando");
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