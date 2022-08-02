const nodemailer = require('nodemailer');
const { google } = require("googleapis");
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.IDCLIENTE,
    process.env.SECRETCLIENTE,
    "https://developers.google.com/oauthplayground",
);

oauth2Client.setCredentials({
    refresh_token: process.env.TOKENGMAIL,
});

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        type: 'OAuth2',
        user: 'santorumbeiker068@gmail.com',
        clientId: process.env.IDCLIENTE,
        clientSecret: process.env.SECRETCLIENTE,
        refreshToken: process.env.TOKENGMAIL,
        accessToken: oauth2Client.getAccessToken(),
    },
})

const mailOptions = (correo, token) => {
    return {
        from: 'santorumbeiker068@gmail.com',
        to: correo,
        subject: 'ShortURL Verificación de Correo',
        html: `<h3>Ingresa al siguiente enlace para verifica tu correo</h3><a href="http://localhost:8000/auth/confirmar/${token}">http://localhost:8000/auth/confirmar/${token}</a>`
    }

}

module.exports = {
    transporter,
    mailOptions,
};
