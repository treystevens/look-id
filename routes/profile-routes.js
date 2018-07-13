const router = require('express').Router();
const mime = require('mime');
const multer = require('multer');
const AccountInfo = require('../models/accInfo');
const User = require('../models/user');
const fs = require('fs');
const TestExplore = require('../models/testexplore');

const { Users, Explore, Posts, Items } = require('../models/schemas');


// express-validator
const { validationResult } = require('express-validator/check');
const { body } = require('express-validator/check');

// bycrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// cloudinary
const cloudinary = require('cloudinary');





// Store files and name format them - 'li-(date).(type)'
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/tmp_images');
    },
    filename: function (req, file, cb) {
      cb(null, 'li' + '-' + Date.now() + '.' + mime.getExtension(file.mimetype));
    }
});

// Checking if the uploaded file matches our accepted file types
const upload = multer({ 
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
        
        // Send to next middleware to process the error
        req.fileValidationError = true;
        return cb(null, false, req.fileValidationError);
      } 
});

// User uploading a post
router.post('/uploadphoto', upload.single('user-photo'), (req, res) => {

    const query = {
        username: req.user.username
    };

    // If user tries to upload a post without an image or filetype that is not supported
    if(typeof req.file === 'undefined'){
        return res.status(422).json({ error: 'LookID only supports png, jpg, and jpeg.' });
    }
    
    // Create a post ID
    const usernameLength = req.user.username.length;
    const userASCII = req.user.username.charCodeAt(0) + req.user.username.charCodeAt(usernameLength - 1);
    const timestamp = Date.now();
    const postID = `${userASCII}${timestamp}`;
    

    // Save image to cloudinary
    cloudinary.v2.uploader.upload(req.file.path,
        {
            public_id: `${postID}`
        }, 
        (error, result) => {

            if(error){
                return res.status(422).json({ error: 'File could not be uploaded' });
            }

            // post to Posts
            const newPost = {
                username: req.user.username,
                post_id: postID,
                caption: req.body.usercaption,
                image: result.url,                
            };

            // Send to Users Collection
            const userReferencePost = {
                post_id: postID,
                image: result.url
            };

            // Send post to Explore and this user's followers
            const streamPost = {
                username: req.user.username,
                post: {
                    image: result.url,
                    post_id: postID
                }   
            };

            
            // Create post in Posts Collections
            Posts.create(newPost).then((success) => {

                // Push into User Collection with reference to original post to display 'Other Posts'
                Users.findOneAndUpdate(query, {$push: {posts: userReferencePost}}).then((user) => {
                    console.log(user);
                });

                // Send new Post to Explore Collection
                Explore.create(streamPost);

                // Delete file from temporary folder
                fs.unlink(`${req.file.path}`, (err) => {
                    if (err) throw err;
                });

                // Send the new post ID back for redirect on client side
                res.json({postID: postID});

            })

            .catch( (err) => {
                console.log(err);
            });
        });
     
});

// Upload users items after uploading photo
router.post('/uploaditems', (req, res) => {

    const itemDocument = {
        post_id : req.body.postID,
        items: req.body.items
    }; 

    // Add items with a reference to the post in Items Collection
    Items.create(itemDocument)
    .then( () => {
        res.json({success: true});
    })
    .catch( (err) => {
        res.json({success: false});
        console.log(err);
    });
});


router.get('/edit', (req, res) => {

    const query = {
        username: req.user.username
    };

    Users.findOne(query)
    .then( (user) => {

        // The available fields to edit on 'Edit Profile'
        userProfileInfo = {
            avatar: user.profile.avatar,
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

    console.log(req.body);

    const query = {
        username: req.user.username
    };
    const userUpdate = {
        bio: req.body.bio,
        website: req.body.website,
    };
    const imgFromAvatarSrc = req.body.imageFromAvatarSrc;
    const defaultAvatar = 'https://res.cloudinary.com/dr4eajzak/image/upload/v1530898955/avatar/default-avatar.jpg';

    // File for avatar display image was not permitted for upload
    if(req.fileValidationError){
        return res.status(422).json({ errors: 'LookID only supports the following file types - .png, .jpg, and .jpeg"' });
    }

    
    
    // User decides not to change their avatar, so the req.file will be undefined. Taking the src of the image that was previously uploaded to cloudinary to set back into database
    if(req.file === undefined){

        userUpdate.avatar = defaultAvatar;
        
        // Update user's website and bio
        Users.findOneAndUpdate(query, {$set: {profile: userUpdate}}, {'new': true})
        .then( (userRequest) => {

            // Send back updated profile
            res.json({success: true, user: userRequest, myUsername: req.user.username});
        })
        .catch( (err) => {
            console.log(err);
        });
    }
    else{

    // Save image to cloudinary
    cloudinary.v2.uploader.upload(req.file.path,
        {
            public_id: `${req.user.username}_avatar`
        }, 
        (error, result) => {
            if(error){
                return res.status(422).json({ errors: 'File could not be uploaded' });
            }


            // Set avatar to the link provided from Cloudinary
            userUpdate.avatar = result.url;

            // Update user's profile settings
            Users.findOneAndUpdate(query, {$set: {profile: userUpdate}}, {'new': true})
            .then( (userRequest) => {

                console.log(userRequest);

                // Delete the uploaded file out the temporary folder
                fs.unlink(`${req.file.path}`, (err) => {
                    if (err) throw err;
                });  

                // Send back updated profile
                res.json({success: true, user: userRequest, myUsername: req.user.username});

                    
            })
            .catch( (err) => {
                console.log(err);
            });
        });
    }    
});


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

    // Find user - Check if password matches the one in database
    // If so - Get the new password and password confirmation - Update password field in database
    User.findById(req.user.id).then( (userData) => {
        bcrypt.compare(enteredPassword, userData.password)
        .then( (response) => {
            
            // Password does not match one in database
            if(!response){
                res.json({success: false});
            }
            else{
                // Hash the new password 
                bcrypt.hash(newPassword, saltRounds).then( (hash) => {
                
                    User.findByIdAndUpdate(userID, {password: hash})
                    .then((data) => {
                        
                        res.json({success: true});
                    })
                    .catch((err) => {
                        console.log(err);
                    });
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