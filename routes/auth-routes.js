const router = require('express').Router();
const passport = require('passport');
const passportSetup = require('../config/passport-setup');

const { check, validationResult } = require('express-validator/check');
const { body } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
const bcrypt = require('bcrypt');

const saltRounds = 10;
// Models
const User = require('../models/user');
const express = require('express')

// const app = express();
// const bodyParser = require('body-parser');
// app.use(bodyParser.json());

const authCheck = (req, res, next) => {
    if(req.user){
        next()
    }
    else{
        res.json({guest: true});
    }
}

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
    
});


router.get('/', (req, res) => {
    console.log(req.user,` current user logged in`);
    console.log(req.isAuthenticated(), `if the request is authenticated..should be true if theres a user`)
    console.log(req.session)
    console.log('was requested')


    res.json({guest: false})
})


router.get('/login', (req, res) => {

    if(req.user){
        // res.redirect('/profile');
        console.log(req.user);
        console.log(`inside get login`)
        // res.redirect('http://localhost:3000/');
    }
    else{
        res.render('pages/login', {});
    }
    // console.log(req.user, `req user from get login`);
    
    
});

router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res, next) => {

    const username = req.body.username;
    const password = req.body.password;

    // console.log(username)
    // console.log(password)

    let currentUser = {
        username: req.user.username,
        userID: req.user.id
    }

    console.log(req.user, ` request user`)
    // res.redirect('/profile');
    // console.log(req.cookie, `cookie`)
    console.log(currentUser, `CURRENT USER`)
    res.json({success:true, user: currentUser});

    // User.findOne({ username: {$regex: username, $options: 'i'} })
    // .then((user) => {

    //     if(user){
    //         bcrypt.compare(password, user.password).then( (passwordMatch) => {
    //             // Correct password
    //             if(passwordMatch){
    //                 req.login(user, (err) => {
    //                     if (err) { 
    //                         return next(err); 
    //                     }

                        
                        
    //                   });
    //             }
    //             else{
    //                 // res.redirect('/login');
    //                 console.log('fail')
    //                 res.json({errors: 'Username or password is incorrect'});
    //             }     
    //         });
    //     }
    //     else{
    //         res.json({errors: 'Username or password is incorrect'});
    //     }

        
    //   })
    //   .catch((err) => {
    //       console.log(err);
    //   });

       
});


router.get('/signup', (req, res) => {  
    res.render('pages/register');
});

router.post('/signup', [
    body('username') // Username validation
    .isLength({ min: 3 })
    .withMessage('Username must be at least 3 characters long.')
    .trim()
    .isAlphanumeric()
    .withMessage('Username must have only letters or numbers.')
    .custom( (value, {req} ) => {
        
        // Create an index for usernames for unique names
        // return User.findOne({username: value})
        return User.findOne({username: {$regex: value, $options: 'i' }})
        .then((user) => {
            if(user){
                return Promise.reject(`The username "${req.body.username}" is already taken.`);
            }
        })
        .catch((err) => {
            throw new Error(err);            
        });
        
    }),
    body('password') // Password validation
    .isLength({ min: 3 })
    .withMessage('Password must be at least 6 characters long.')
    .matches(/\d/)
    .withMessage('Password must have at least one number.'),
    body('passwordconfirmation') // Password confirmation validation
    .custom( (value, { req } ) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        else{
            return Promise.resolve(value);
        }
        
    })], (req, res, next) => {
        
    // Errors from the register account validation form  
    const registrationErrors = validationResult(req);
    
    // Errors are found on the form
    if(!registrationErrors.isEmpty()){  
        let mappedErrors = registrationErrors.mapped();
        console.log(mappedErrors, `mapped errors`);

        console.log(req.body, `req body`)
        
        mappedErrors.usernameValue = req.body.username || '';

        return res.status(422).json({ errors: mappedErrors })
        // return res.json({ errors: mappedErrors });
        // res.render('pages/register', {errMessage: mappedErrors});
    }

    // Place the new user into the database
    else{
        const user = {
            username: req.body.username,
            password: req.body.password
        };
        
        // Hash password and store into database
        bcrypt.hash(user.password, saltRounds).then( (hash) => {
            user.password = hash;

            User.create(user).then((newUser) => {
                req.login(newUser, (err) => {
                    if (err) { 
                        return next(err); 
                    }
                    console.log('new user', newUser)
                    // return res.json({ errors: errors.mapped() });
                    res.json({ success: true})
                    // res.redirect('/profile');
                  });
            });
        })
        .catch((err) => {
            console.log(err);
        });
          
    }
});

router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/login');
});








module.exports = router;