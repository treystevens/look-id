const router = require('express').Router();
const passport = require('passport');

// express-validator
const { validationResult } = require('express-validator/check');
const { body } = require('express-validator/check');

// bycrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// Models
const User = require('../models/user');


router.get('/', (req, res) => {

    console.log(req.user,` current user logged in`);
    console.log(req.isAuthenticated(), `if the request is authenticated..should be true if theres a user`)
    console.log(req.sessionID, `session ID`)
    console.log(req.headers, `headers from request`)
    

    res.json({guest: false})
})


router.get('/login', (req, res) => {

    res.json({actionSuccess: true})
    
    
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {

    console.log(req.user, `user after login authentication, will be false if there's no user or wrong password`)
    const username = req.body.username;
    const password = req.body.password;

    let currentUser = {
        username: req.user.username,
        userID: req.user.id
    }
    
    console.log('we are inside the post login')

    res.json({actionSuccess: true, user: currentUser});
    
       
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
                    console.log('new user that was logged in', newUser)

                    let currentUser = {
                        username: user.username,
                        userID: user.id
                    };

                    res.json({user: currentUser});
                    
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
    res.json({actionSuccess: true, isAuth: false})
});








module.exports = router;