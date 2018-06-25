const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Taking stuff from our record and passing it into a cookie
// When we're done we're stuffing this done method the userID, when its called its passed off somewhere else and we stuff that ID into a cookie
// ONLY SENDING OUT THE ID IN THE COOKIE
// Grabbing that user id and saying done, Im going to pass you to the next stage
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// when we get it back, who's id is this? who is the user
// When we get it back and we unpackage the cookie
// Take that ID and get a user from that ID..deserialize the cookie..taking the id
// GETTING THE ID FROM THE COOKIE BECAUSE WE DONT KNOW WHICH USER IT IS. WHO'S ID IS THIS, WHO IS THE USER
// when it comes back from the browser we handle this bad boy
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        // What this will do is attach the user property to the req object so that we can access it inside a route handler
        done(null, user);
    });
    
});

// can use req.login when I post in the log in page... and use req.user and req.isAuthenticated()

passport.use(new LocalStrategy( (username, password, done) => {
    User.findOne({ username: {$regex: username, $options: 'i'} })
    .then((user) => {
        console.log(user, `this is the user from passport setup`);
        bcrypt.compare(password, user.password).then( (res) => {
            
            // Correct password
            if(res){
                return done(null, user);
            }
            else{
                return done(null, false);
            }     
        });
      })
      .catch((err) => {
          console.log(err);
      });
    }
));

