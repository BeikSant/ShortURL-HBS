const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const { create } = require('express-handlebars');
require('dotenv').config();
require('./database/db')

const app = express();

app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false,
    name: 'secret-session-security'
}));

app.use(flash());

const hbs = create({
    extname: '.hbs',
    partialsDir: 'views/components'
});

app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views')

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use('/', require('./routes/home'));
app.use('/auth', require('./routes/auth'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log('Servidor corriendo ', PORT));
