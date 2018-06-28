const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');


const bcrypt = require('bcrypt');
// const { check, validationResult } = require('express-validator/check');
// const { body } = require('express-validator/check');
// const { sanitizeBody } = require('express-validator/filter');

const passportSetup = require('./config/passport-setup');



// Models
const User = require('./models/user');

// Routes
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');


// Authentication
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);



require('dotenv').config();

const port = process.env.PORT || 3000;


const app = express();


mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_DB).then((data) => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



// app.use(expressValidator(middlewareOptions));
// Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static( __dirname + '/public'));

// app.set('trust proxy', 1)
app.use(session({
    cookie: {
        // one day. 24 hrs * 60 mins * 60seconds * 1000 milli in a second
        maxAge: 24 * 60 * 100 * 1000
    },
    secret: process.env.COOKIE_SECRET,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(passport.initialize());
app.use(passport.session());



// Routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);


app.listen(port, ()=> {
    console.log(`${port}, we're listening`);
});





