const express = require('express');

const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const passportSetup = require('./config/passport-setup');

// Routes
const authRoutes = require('./routes/auth-routes');
const profileRoutes = require('./routes/profile-routes');
const userRoutes = require('./routes/user-routes');
const streamRoutes = require('./routes/stream-routes');
const commentRoutes = require('./routes/comment-routes');
const boardRoutes = require('./routes/board-routes');
const searchRoutes = require('./routes/search-routes');



// Authentication
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);



require('dotenv').config();

const mongoDB = process.env.MONGODB_URI || 'mongodb://localhost/lookid';
const port = process.env.PORT || 4500;
const sessionSecret = process.env.HEROKU_SESSION_SECRET || process.env.LOCAL_SESSION_SECRET;


const app = express();

const cloudinary = require('cloudinary');


cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


mongoose.Promise = global.Promise;
mongoose.connect(mongoDB).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.log(err);
});

// Configure view engine to render EJS templates.
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');



// Middleware

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static( __dirname + '/public'));

app.use(session({
    cookie: {
        // Live for one day
        maxAge: 24 * 60 * 100 * 1000
    },
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
}));
app.use(passport.initialize());
app.use(passport.session());



// Routes
app.use('/auth', authRoutes);
app.use('/profile', profileRoutes);
app.use('/user', userRoutes);
app.use('/stream', streamRoutes);
app.use('/comment', commentRoutes);
app.use('/board', boardRoutes);
app.use('/search', searchRoutes);


if (process.env.NODE_ENV === 'production') {
    
    // Serve any static files
    app.use(express.static(path.join(__dirname, 'client/build')));

    // Handle React routing, return all requests to React app
    app.get('*', function(req, res) {
      res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
    });
}


app.listen(port, ()=> {
    console.log(`${port}, we're listening`);
});





