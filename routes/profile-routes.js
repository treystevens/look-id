const router = require('express').Router();
const mime = require('mime');
const multer = require('multer');
const AccountInfo = require('../models/accInfo');
const User = require('../models/user');


// express-validator
const { validationResult } = require('express-validator/check');
const { body } = require('express-validator/check');

// bycrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;




let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/photo_storage');
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
        if(!accept){
            return cb(null, false);
        }
        // Something goes wrong
        // cb(new Error("Error: File upload only supports the following filetypes - png, jpg, and jpeg"));
      } 
});


router.get('/', (req, res) => {
    const query = {
        username: req.user.username
    };

    AccountInfo.findOne(query)
    .then( (user) => {
        res.json({user: user});
    })
    .catch( (err) => {
        console.log(err);
    });

    res.json({success: 'got profile'});
});


router.post('/uploadpost', upload.single('userphoto'), (req, res) => {

    if(req.file === undefined){
        return res.status(422).json({ errors: 'LookID only supports the following file types - .png, .jpg, and .jpeg"' });
    }
    res.json({test: 'sending back info'});
    
    
});

router.get('/edit', (req, res) => {


    AccountInfo.findOne({})
    .then((response) => {
        console.log(response, `response for looking user name`);
        res.json({success: true});
        // res.json({bio: res.profile.bio, website: res.profile.website});
    })
    .catch((err) => {
        console.log(err);
    });
});

router.post('/edit', (req, res) => {

    const query = { username: req.user.username};
    const profileSettings = {
        bio: req.body.bio,
        website: req.body.website
    };

    // Edit user profile settings
    AccountInfo.findOneAndUpdate(query, {profile: profileSettings})
    .then((user) => {

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

router.post('/settings/delete-account', (req, res) => {


    // Check the password matches on in the database
    // If so - delete the document from the database
    User.findByIdAndUpdate(req.user.id).then((data) => {
            
                
    });



    // Hash password and store into database
    bcrypt.hash(user.password, saltRounds).then( (hash) => {
        user.password = hash;


        
    })
    .catch((err) => {
        console.log(err);
    });

});


module.exports = router;