const router = require('express').Router();
const mime = require('mime');
const multer = require('multer');
const AccountInfo = require('../models/accInfo');
const User = require('../models/user');
const fs = require('fs');
const TestExplore = require('../models/testexplore');


// express-validator
const { validationResult } = require('express-validator/check');
const { body } = require('express-validator/check');

// bycrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;

// cloudinary
const cloudinary = require('cloudinary');

let testingExp = new TestExplore();



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
        
        req.fileValidationError = true;
        return cb(null, false, req.fileValidationError);
        // Something goes wrong
        // cb(new Error("Error: File upload only supports the following filetypes - png, jpg, and jpeg"));
      } 
});

router.post('/uploadphoto', upload.single('user-photo'), (req, res) => {
    const query = {
        username: req.user.username
    };


    if(typeof req.file === 'undefined'){
        return res.status(422).json({ error: 'LookID only supports png, jpg, and jpeg' });
    }
    
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
            const post = {
                post_id: postID,
                caption: req.body.usercaption,
                image: result.url,
                timestamp: timestamp,
                liked: []
            };

            const otherPost = {
                post_id: postID,
                image: result.url
            };

            const streamPost = {
                username: req.user.username,
                post: {
                    image: result.url,
                    post_id: postID
                }   
            };


            if(error){
                return res.status(422).json({ error: 'File could not be uploaded' });
            }

            

            // Update user's profile settings
            AccountInfo.findOneAndUpdate(query, { $push: {posts: post, other_posts: otherPost}}, {new: true})
            .then( (docu) => {
              console.log(docu)

                // testingExp.stream.unshift(streamPost);
                // testingExp.save( (err) => {
                //     console.log(err);
                // });

                TestExplore.update({stream: streamPost});

                // Delete the uploaded file out the temporary folder
                fs.unlink(`${req.file.path}`, (err) => {
                    if (err) throw err;
                });

                // Send the new post ID back
                res.json({postID: postID});
            })
            .catch( (err) => {
                console.log(err);
            });
        });
     
});


router.post('/uploaditems', (req, res) => {
    const query = {
        "posts.post_id": req.body.postID
    }; 
 
    // Update the items for that specific post
    AccountInfo.findOneAndUpdate(query, {$set: {"posts.$.items": req.body.items}}, {new: true})
    .then( () => {
        res.json({success: true});
    })
    .catch( (err) => {
        console.log(err);
    });
    
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

    const query = {
        username: req.user.username
    };

    const userUpdate = {
        bio: req.body.bio,
        website: req.body.website,
    };

    const prevAvatarUrl = req.body.avatarUrl

    // File for avatar display image was not permitted for upload
    if(req.fileValidationError){
        return res.status(422).json({ errors: 'LookID only supports the following file types - .png, .jpg, and .jpeg"' });
    }
    

    // If user decides to not change their avatar image
    // Form.append sends the boolean value as a string
    if(req.body.sameAvatar === 'true'){

        
        // Update user's website and bio
        AccountInfo.findOneAndUpdate(query, {$set: {profile: userUpdate}})
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
            AccountInfo.findOneAndUpdate(query, {$set: {profile: userUpdate}})
            .then( (userRequest) => {

                // Delete the uploaded file out the temporary folder
                fs.unlink(`${req.file.path}`, (err) => {
                    if (err) throw err;
                });



                AccountInfo.find({avatar: prevAvatarUrl}).then((data) => {
                    console.log(data);
                });
  
                    
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