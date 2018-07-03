const router = require('express').Router();
const mime = require('mime');
const multer = require('multer');
const AccountInfo = require('../models/accInfo');
const User = require('../models/user');
const fs = require('fs');


// express-validator
const { validationResult } = require('express-validator/check');
const { body } = require('express-validator/check');

// bycrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// cloudinary
const cloudinary = require('cloudinary');


// cloudinary.config({ 
//     cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
//     api_key: process.env.CLOUDINARY_API_KEY,
//     api_secret: process.env.CLOUDINARY_API_SECRET
// });


// Original with date changing
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/tmp_images');
    },
    filename: function (req, file, cb) {
    //   cb(null, 'li' + '-' + Date.now());
      cb(null, 'li' + '-' + Date.now() + '.' + mime.getExtension(file.mimetype));
    }
});


// let storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, './public/tmp_images');
//     },
//     filename: function (req, file, cb) {
//     //   cb(null, 'li' + '-' + Date.now());
//       cb(null, file.name + mime.getExtension(file.mimetype));
//     }
// });

let upload = multer({ 
    storage: storage,
    fileFilter: function (req, file, cb) {

        let accept = false;
        let acceptableTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        let uploadedFileExtension = file.mimetype;
    
        for(let extension of acceptableTypes){
            if(uploadedFileExtension == extension){
                accept = true;
            }
        }
    
        if (accept) {
            // To accept the file
            return cb(null, true);
        }
        if(!accept){
            return cb(null, false);
        }
        // Something goes wrong
        // cb(new Error("Error: File upload only supports the following filetypes - png, jpg, and jpeg"));
      } 
});


router.get('/', (req, res) => {
    // // Display Pictures, followers, bio, avatar main profile page

    // const query = {
    //     username: req.user.username
    // };
    

    // AccountInfo.findOne(query)
    // .then( (user) => {

    //     const neededData = {
    //         followerCount: user.followers.length,
    //         followingCount: user.following.length,
    //         bio: user.profile.bio,
    //         website: user.profile.website,
    //         avatar: user.profile.avatar
    //     };

    //     res.json({user: neededData});
    // })
    // .catch( (err) => {
    //     console.log(err);
    // });

});


router.post('/uploadpost', upload.single('user-photo'), (req, res) => {

    if(req.file === undefined){
        return res.status(422).json({ errors: 'LookID only supports the following file types - .png, .jpg, and .jpeg"' });
    }
    res.json({test: 'sending back info'});
    
    
});


router.get('/edit', (req, res) => {

    const query = {
        username: req.user.username
    };

    AccountInfo.findOne(query)
    .then( (user) => {

        userProfileInfo = {
            // avatar: user.display_image,
            bio: user.profile.bio,
            website: user.profile.website
        };

        res.json({user: userProfileInfo});
    })
    .catch( (err) => {
        console.log(err);
    });

    
});


router.post('/edit', upload.single('user-avatar'), (req, res) => {

    if(req.file === undefined){
        return res.status(422).json({ errors: 'LookID only supports the following file types - .png, .jpg, and .jpeg"' });
    }
    
    const query = {
        username: req.user.username
    };

    



    console.log(req.file);
    // Save file to folder then take that and put inside cloudinary

    

    // Save image to cloudinary
    cloudinary.v2.uploader.upload(req.file.path,
        {
            public_id: `${req.user.username}_avatar`
        }, 
        (error, result) => {

            const userUpdate = {
                bio: req.body.bio,
                website: req.body.website,
                avatar: result.url
            };

            console.log(result.url, ` this the result tho`);

            if(error){
                return res.status(422).json({ errors: 'File could not be uploaded' });
            }

            // Update user's profile settings
            AccountInfo.findOneAndUpdate(query, {$set: {profile: userUpdate}})
            .then( (user) => {

                // Delete the uploaded file out the temporary folder
                fs.unlink(`${req.file.path}`, (err) => {
                    if (err) throw err;
                });

                // Send the new updated profile settings back
                res.json({success: true, user: user});
            })
            .catch( (err) => {
                console.log(err);
            });
        });


    
});

function checkPasswordMatch(userID, enteredPassword){
    
    let passwordMatch;

    User.findById(userID).then( (userData) => {
        bcrypt.compare(enteredPassword, userData.password)
        .then( (res) => {
            console.log(res, `this is the response inside the bcyrpt compare`);

            // passwordMatch = Promise.resolve(res);
            console.log(passwordMatch, ` this is passwordmatch inside function`)
            // return passwordMatch;
            // passwordMatch = res;
            // return res

            return new Promise(res);

            // return passwordMatch;
        });

        
    })
    .catch((err) => {
        console.log(err);
    });

    // return passwordMatch;
}






router.post('/settings/change-password',[
    body('newPassword') // Password validation
    .isLength({ min: 3 })
    .withMessage('Password must be at least 6 characters long.')
    .matches(/\d/)
    .withMessage('Password must have at least one number.'),
    body('confirmPassword') // Password confirmation validation
    .custom( (value, { req } ) => {
        if (value !== req.body.newPassword) {
          throw new Error('Password confirmation does not match password');
        }
        else{
            return Promise.resolve(value);
        }
        
    })] ,(req, res) => {

    const validationErrors = validationResult(req);

    if(!validationErrors.isEmpty()){  
        let mappedErrors = validationErrors.mapped();
        console.log(mappedErrors, `mapped errors`);

        return res.status(422).json({ errors: mappedErrors });

    }

    const enteredPassword = req.body.password;
    const newPassword = req.body.newPassword;
    const userID = req.user.id;

    console.log(req.body);




    // Find user - Check if password matches the one in database
    // If so - Get the new password and password confirmation - Update password field in database
    User.findById(req.user.id).then( (userData) => {
        bcrypt.compare(enteredPassword, userData.password)
        .then( (response) => {
            console.log(response, ` resonseeee`)
            // Password does not match one in database
            if(!response){
                res.json({success: false});
            }
            else{
                // Hash the new password 
                bcrypt.hash(newPassword, saltRounds).then( (hash) => {
                
                    User.findByIdAndUpdate(userID, {password: hash})
                    .then((data) => {
                        console.log(data)
                        res.json({success: true});
                    })
                    .catch((err) => {
                        console.log(err)
                    })
                });
            }
        })
        .catch((err) => {
            console.log(err);
        });
  
    })
    .catch((err) => {
        console.log(err);
    });

});

router.post('/settings/delete-account',[
    body('username')
    .custom( (value, { req } ) => {
        if (value !== req.user.username) {
          throw new Error('Enter your username');
        }
        else{
            return Promise.resolve(value);
        }
    }),
    body('confirmPassword') // Password confirmation validation
    .custom( (value, { req } ) => {
        if (value !== req.body.password) {
          throw new Error('Password confirmation does not match password');
        }
        else{
            return Promise.resolve(value);
        }
    })], (req, res) => {

        const validationErrors = validationResult(req);

        if(!validationErrors.isEmpty()){  
            let mappedErrors = validationErrors.mapped();
            console.log(mappedErrors, `mapped errors`);

            return res.status(422).json({ errors: mappedErrors });

    }

        console.log('we are hittin ght eaccount')

    // Check the password matches on in the database
    // If so - delete the document from the database
    User.findById(req.user.id).then( (userData) => {
        bcrypt.compare(req.body.password, userData.password)
        .then( (response) => {
            // Password does not match one in database
            if(!response){
                res.json({success: false});
            }
            else{
                // Delete user
                userData.remove();
                req.logout();
                res.json({success: true, isAuth: false});
            }
        })
        .catch((err) => {
            console.log(err);
        });
  
    })
    .catch((err) => {
        console.log(err);
    });

});


module.exports = router;