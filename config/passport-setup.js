const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user');

// Packs the user id into a cookie
passport.serializeUser((user, done) => {
    console.log(user, `serialized user`);
    done(null, user.id);
});

// Get back the user from the session
passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {

        // Attaches user to req
        done(null, user);
    });
    
});

passport.use(new LocalStrategy( (username, password, done) => {
    User.findOne({ username: {$regex: username, $options: 'i'} })
    .then((user) => {
        console.log(user, `not found user`)
        if(!user){
           return done(null, false) 
        }

        bcrypt.compare(password, user.password).then( (res) => {
            console.log(user, 'user from what we put in');
            console.log(res, `response from comparing the bcyrpt`)

            const currentUser = {
                id: user.id,
                username: user.username

            }
            // Correct password
            if(res){
                return done(null, currentUser);
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
