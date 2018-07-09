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
const AccountInfo = require('../models/accInfo');


router.get('/', (req, res) => {
    
    if(req.isAuthenticated()){
        const query = {
            username: req.user.username
        };

        AccountInfo.findOne(query)
        .then((data) => {
            const currentUser = {
                username: req.user.username,
                avatar: data.profile.avatar
            };

            res.json({isAuth: true, user: currentUser}); 
        })
        .catch((err) => {
            console.log(err);
        });
    }
    else{
        res.json({isAuth: false});
    }    

    
});


router.get('/login', (req, res) => {

    res.json({actionSuccess: true});
    
    
});

router.post('/login', passport.authenticate('local'), (req, res, next) => {

    const query = { username: req.user.username };

    const currentUser = {
        username: req.user.username,
        userID: req.user.id,
    };

    // Query to get the user's avatar
    AccountInfo.findOne(query)
    .then((data) => {

        currentUser.avatar = data.profile.avatar;
        res.json({actionSuccess: true, user: currentUser}); 
    })
    .catch((err) => {
        console.log(err);
    });
    
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
        const usernameValue = value;
        const usernameRegex = new RegExp(`^${usernameValue}$`);
// at this point, the line above is the same as: var regex = /#abc#/g;
        // Create an index for usernames for unique names
        // return User.findOne({username: value})
        return User.findOne({username: {$regex: usernameRegex, $options: 'i' }})
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
    body('confirmPassword') // Password confirmation validation
    .custom( (value, { req } ) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        else{
            return Promise.resolve(value);
        }
        
    })], (req, res, next) => {
        
    // Errors from the register account validation form  
    const validationErrors = validationResult(req);
    
    // Errors are found on the form
    if(!validationErrors.isEmpty()){  
        let mappedErrors = validationErrors.mapped();
        console.log(mappedErrors, `mapped errors`);

        console.log(req.body, `req body`);
        
        mappedErrors.usernameValue = req.body.username || '';

        return res.status(422).json({ errors: mappedErrors });
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
                const defaultAvatar = 'https://res.cloudinary.com/dr4eajzak/image/upload/v1530898955/avatar/default-avatar.jpg';

                const defaultUserProfile = {
                    profile: {
                        avatar: defaultAvatar,
                        bio: '',
                        website: ''
                    }
                };

                let currentUser = {
                    username: user.username,
                    userID: user.id
                };


                // Save new user into Data Collection 
                AccountInfo.create({username: user.username}).then(() => {
                    AccountInfo.findOneAndUpdate({username: user.username},{$set: defaultUserProfile}, {new: true} ).then((data) => {
                        console.log(data, `data to set the updated userprofile`);

                        // Authenticate new user
                        req.login(newUser, (err) => {
                            if (err) { 
                                return next(err); 
                            }
                            
                            // Make sure avatar link is getting passed back so that we can have as a redux store state
                            currentUser.avatar = data.profile.avatar;

                            

                            res.json({user: currentUser});
                            
                        });


                        console.log(data);
                    })
                    .catch((err) => console.log(err));
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
    res.json({actionSuccess: true, isAuth: false});
});








module.exports = router;