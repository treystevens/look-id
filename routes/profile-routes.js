const router = require('express').Router();
const mime = require('mime');
const multer = require('multer');
const fs = require('fs');

// Mongoose Models
const models = require('../models/schemas');

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
        const acceptableTypes = ['image/png', 'image/jpeg', 'image/jpg'];
        const uploadedFileExtension = file.mimetype;
    
        
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
                return res.status(415).json({ error: 'File could not be uploaded.' });
            }

            // post to Posts
            const newPost = {
                username: req.user.username,
                post_id: postID,
                caption: req.body.usercaption,
                image: result.url,                
            };

            // Send to models.Users Collection
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
            models.Posts.create(newPost)
            .then( (newPost) => {

                if(!newPost) return Promise.reject(new Error('We cannot upload your post at the moment.'));

                // Send new Post to Explore Collection
                // Push into User Collection with reference to original post to display 'Other Posts'
                return Promise.all([
                    models.Explore.create({post: newPost._id}),
                    models.Users.findOneAndUpdate(query, {$push: {posts: userReferencePost}})
                ]);
            })
            .then((result) => {

                // Push postID to the user's followers to appear in their feed items
                // Unshift to feed_items array
               return models.Feed.update(
                    { username: { $in: result[1].followers }  }, 
                    { $push: { 
                        feed_items: {
                            $each: [result[0].post],
                            $position: 0
                            } 
                        } 
                    },
                    { multi: true });
            })
            .then(() => {

                 // Delete file from temporary folder
                 fs.unlink(`${req.file.path}`, (err) => {
                    if (err) throw err;
                });
            
                // Send the new post ID back for redirect on client side
                res.json({postID: postID});
            })
            .catch( (err) => {
                res.json({error: err});
                console.log(err);
            });
        });
});

// Upload users items after uploading photo
router.post('/uploaditems', (req, res) => {


    const postQuery = {
        post_id: req.body.postID
    };
    const postID = req.body.postID;
    const itemDocument = {
        // post_id : req.body.postID,
        items: req.body.items
    }; 
    let itemID;

    
    // Create item document, retrieve item _id
    models.Items.create(itemDocument)
    .then( (item) => {
        
        if(!item) return Promise.reject(new Error('Problem with creating items.'));

        itemID = item.id;

        // Add the items _id to the selected Posts 'item' field
        return models.Posts.findOneAndUpdate(
            postQuery, 
            { $set: { items: item.id } }
        );
    })
    .then((postDoc) => {


        // Update post field in Items collection with the post _id
        return models.Items.findByIdAndUpdate(
            itemID,
            {$set: {post: postDoc.id}}
        );
    })
    .then(() => {
        res.status(200).json({success: true});
    })
    .catch( (err) => {
        res.json({error: err});
        console.log(err);
    });
});

// Edit profile - Avatar, Website, Bio
router.get('/edit', (req, res) => {

    const query = {
        username: req.user.username
    };

    models.Users.findOne(query)
    .then( (user) => {
        if(!user) return Promise.reject(new Error('Unable to retrieve your profile information at the moment.'));
        
        // The available fields to edit on 'Edit Profile'
        userProfileInfo = {
            avatar: user.profile.avatar,
            bio: user.profile.bio,
            website: user.profile.website
        };

        res.json({user: userProfileInfo});
    })
    .catch( (err) => {
        res.status(500).json({errors: err});
        console.log(err);
    });
});

// Upload avatar image, website or bio
router.post('/edit', upload.single('user-avatar'), (req, res) => {


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
        return res.status(422).json({ error: 'LookID only supports the following file types - .png, .jpg, and .jpeg' });
    }

    
    // User decides not to change their avatar, so the req.file will be undefined. Taking the src of the image that was previously uploaded to cloudinary to set back into database
    if(req.file === undefined){

        userUpdate.avatar = imgFromAvatarSrc;
        
        // Update user's website and bio
        models.Users.findOneAndUpdate(query, {$set: {profile: userUpdate}}, {'new': true})
        .then((data) => {
            if(!data) return Promise.reject(new Error('User not found.'));

            res.status(200);
        })
        .catch( (err) => {
            res.status(500).json({error: err});
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
                return Promise.reject(new Error('File could not be uploaded.'));
            }

            // Set avatar to the link provided from Cloudinary
            userUpdate.avatar = result.url;

            // Update user's profile settings
            models.Users.findOneAndUpdate(query, {$set: {profile: userUpdate}}, {'new': true})
            .then( (userRequest) => {

                // Delete the uploaded file out the temporary folder
                fs.unlink(`${req.file.path}`, (err) => {
                    if (err) throw err;
                });  

                // Send back updated profile
                res.json({ user: userRequest, myUsername: req.user.username });
            })
            .catch( (err) => {
                res.json({error: err});
                console.log(err);
            });
        });
    }    
});

// Change user password
router.post('/settings/change-password',[
    body('password')
    .custom( (value, { req } ) => {

        // Find user > Check if password matches the one in database
        return models.Users.findById(req.user.id).then( (userData) => {
           return bcrypt.compare(value, userData.password)
            .then( (response) => {
            
                // If password does not match, reject value
                if(!response){
                    return Promise.reject('This password is incorrect.');
                }
                else{
                    return Promise.resolve(value);
                }
            });
        })
        .catch((err) => {
            throw new Error(err);
        });
        
    }),
    body('newPassword') // Password validation
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long.')
    .matches(/\d/)
    .withMessage('Password must have at least one number.'),
    body('confirmPassword') // Password confirmation validation
    .custom( (value, { req } ) => {
        if (value !== req.body.newPassword) {
          throw new Error('Password confirmation does not match password.');
        }
        else{
            return Promise.resolve(value);
        }
        
    })] ,(req, res) => {


    const validationErrors = validationResult(req);

    // Send to client the errors from express-validator
    if(!validationErrors.isEmpty()){  

        const mappedErrors = validationErrors.mapped();
        return res.status(422).json({ validationErrors: mappedErrors });
    }

    const newPassword = req.body.newPassword;
    const userID = req.user.id;
                
    // Hash the new password 
    bcrypt.hash(newPassword, saltRounds)
    .then( (hash) => {
    
        if(!hash) return Promise.reject(new Error('Could not properly secure your password, please try again later.'));

        return models.Users.findByIdAndUpdate(userID, {password: hash});
        
    })
    .then(() => {
        res.status(200);
    })
    .catch((err) => {
        res.json({error: err});
        console.log(err);
    }); 
});


// Delete user account
router.post('/settings/delete-account',[
    body('username')
    .custom( (value, { req } ) => {
        if (value !== req.user.username) {
          throw new Error('Please enter your username.');
        }
        else{
            return Promise.resolve(value);
        }
    }),
    body('password')
    .custom( (value, { req } ) => {

        // Find user > Check if password matches the one in database
        return models.Users.findById(req.user.id).then( (userData) => {
           return bcrypt.compare(value, userData.password)
            .then( (response) => {
            
                // If password does not match, reject value
                if(!response){
                    return Promise.reject('This password is incorrect.');
                }
                else{
                    return Promise.resolve(value);
                }
            });
        })
        .catch((err) => {
            throw new Error(err);
        });
        
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
    
            return res.status(422).json({ validationErrors: mappedErrors });

    }

    const username = req.user.username;
    const usernameQuery = {
        username: username
    };
    let userID;


    // First get the user's _id
    models.Users.findOne(usernameQuery)
    .then((user) => {

        userID = user._id;
        const usersIFollow = user.following.map(user => user);

        // Remove my username from another user's followers list
        const followersRemove = models.Users.update(
            { username: { $in: usersIFollow } },
            { $pull: { followers: username } },
            { multi: true }
        );

        // Remove my username from another user's following list
        const followingRemove = models.Users.update(
            { following: username },
            { $pull: { following: username } },
            { multi: true }
        );

        // Remove my username from the posts that I have liked
        const likesRemove = models.Posts.update(
            { likes: username },
            { $pull: { likes: username } },
            { multi: true }
        );

        return Promise.all([ followersRemove, followingRemove, likesRemove]);


    })
    .then(() => {

        // Get all the posts that the user has commented on
        return models.Posts.aggregate([{ $match: { 'comments._user': userID } }]).unwind('comments');
    })
    .then((posts) => {

        // Store comment id's of the posts that I commented on
        const commentIDs = posts.map( (post) => {
            return post.comments._id;
        });

        // Pull _id from comments
        return models.Posts.updateMany(
            { 'comments._user': userID },
            { $pull: { 'comments': { "_id": { $in: commentIDs } } }  },
            { multi: true }
        );
    })
    .then(() => {

        // Get the post _id's associated with this user
        return models.Posts.find({username: username});
    })
    .then((data) => {

        // Remove posts from boards, explore and feed along with the post's items

        const posts = data.map(post => post.id);

        const exploreRemove = models.Explore.remove({ post: { $in: posts }});
        const feedPostRemove = models.Feed.update(
            { feed_items: { $in: posts } },
            { $pull: { feed_items: { $in: posts } }} ,
            { multi: true }
        );
        const itemRemove = models.Items.remove( { post: { $in: posts } });

        // Remove post from boards
        const boardPostRemove = models.Users.update(
            { 'boards.posts': { $in: posts } } ,
            { $pull: { 'boards.$.posts': { $in: posts } } },
            { multi: true }
        );

        return Promise.all([ exploreRemove, feedPostRemove, itemRemove, boardPostRemove ]);

    })
    .then(() => {

        // Removing User document from User collection
        const userRemove = models.Users.remove(usernameQuery);

        // Remove all user from Feed collection
        const feedRemove = models.Feed.remove(usernameQuery);

        // Remove all user's posts from Posts collection
        const postsRemove = models.Posts.remove(usernameQuery);
        

        return Promise.all([ userRemove, feedRemove, postsRemove ]);
    })
    .then(() => {

        // Successfully deleted 
        req.logout();
        res.json({success: true});
    })
    .catch((err) => {
        console.log(err);
        res.json({error: err});
    });
});


module.exports = router;