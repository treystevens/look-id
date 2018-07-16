const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const { Users } = require('../models/schemas');

// Packs the user id into a cookie
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Get back the user from the session
passport.deserializeUser((id, done) => {
    Users.findById(id, {username: 1}).then((user) => {
        // Attaches user to request object
        done(null, user);
    });
    
});

passport.use(new LocalStrategy( (username, password, done) => {
    
    const usernameRegex = new RegExp(`^${username}$`);
    
    // Logging in
    Users.findOne({username: {$regex: usernameRegex, $options: 'i'} })
    .then((user) => {
        
        if(!user){
           return done(null, false); 
        }

        // Compare entered password with one stored in database for the user
        bcrypt.compare(password, user.password).then( (res) => {
            const currentUser = {
                id: user.id,
                username: user.username
            };
            
            if(res){    // Correct password
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

