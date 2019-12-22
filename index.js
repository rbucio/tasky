const express = require('express');
const path = require('path');
const pug = require('pug');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('./config/passport');
require('dotenv').config();

const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 3000;


// IMPORT CONTROLLERS
const pagesRoutes = require('./routes/pages.js');
const appRoutes = require('./routes/app.js');

//IMPORT MODELS
require('./models/Projects');
require('./models/Tasks');
require('./models/Users');

// MAKE CONNECTION TO DATABASE
const db = require('./config/db.js');
db.sync()
    .then(() => { console.log('Connection to DB ready')})
    .catch((error) => { console.log(error)})

// CREATE AN INSTANCE OF EXPRESS APPLICATION
const app = express();

app.use(cookieParser());
// ALLOW APP TO PARSE FORMS
app.use(bodyParser.urlencoded({extended:true}));

// SET PATH TO STATIC FILES
app.use(express.static('public'));

// SET VIEW ENGINE
app.set('view engine', 'pug');

// SET PATH TO VIEWS 
app.set('views', path.join(__dirname, 'views'));

// FLASH MESSAGES
app.use(flash());

// SESSIONS
app.use(session({
    secret: 'supersecretkey',
    resave: false,
    saveUninitialized: false
}));

// PASSPORT 
app.use(passport.initialize());
app.use(passport.session());

// LOCAL VARIABLES
app.use((req,res,next) => {
    res.locals.messages = req.flash();
    res.locals.user = { ...req.user } || null;
    next();
});

// APP ROUTES
app.use('/', pagesRoutes());
app.use('/dashboard', appRoutes());

// START SERVER
app.listen(port, host, () => {
    console.log('Server Started!!!');
})