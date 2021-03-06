const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const { create } = require('express-handlebars');
const csrf =  require('csurf');

const User = require('./models/User');
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

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    done(null, { id: user._id, userName: user.userName, isAdmin: user.type === 'admin' ? true : false, blocked: user.blockedAccount});
});

passport.deserializeUser(async (user, done) => {
    const userDB = await User.findById(user.id);
    return done(null, { id: userDB._id, userName: userDB.userName , isAdmin: userDB.type === 'admin' ? true : false,  blocked: userDB.blockedAccount});
});


const hbs = create({
    extname: '.hbs',
    partialsDir: 'views/components',

    helpers: {
        ifCond: function(v1, v2, options) {
            if(v1 === v2) {
            return options.fn(this);
            }
            return options.inverse(this);
        }
    }
});

app.engine('.hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', './views')

app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.use(csrf());

app.use((req, res, next) => { 
    res.locals.csrfToken = req.csrfToken(); //Sirve para evitar ataques de tipo CSRF
    res.locals.mensajes = req.flash("mensajes");
    res.locals.user = req.user || null;
    next();
});

app.use('/', require('./routes/home'));
app.use('/auth', require('./routes/auth'));
app.use('/admin', require('./routes/admin'));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log('Servidor corriendo ', PORT));
