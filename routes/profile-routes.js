const router = require('express').Router();
const express = require('express');
const mime = require('mime');
const app = express();
const multer = require('multer');

const { body } = require('express-validator/check');
const { validationResult } = require('express-validator/check');

let storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './public/photo_storage')
    },
    filename: function (req, file, cb) {
    //   cb(null, 'li' + '-' + Date.now());
      cb(null, 'li' + '-' + Date.now() + '.' + mime.getExtension(file.mimetype));
    }
  })

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



const authCheck = (req, res, next) => {
    if(req.user){
        next()
    }
    else{
        res.redirect('/login');
    }
}

// app.use(authCheck);

router.get('/', authCheck, (req, res) => {
    console.log(req.user,` current user logged in`);
    console.log(req.isAuthenticated(), `if the request is authenticated..should be true`)
    res.render('pages/profile', {user:req.user})
})

router.get('/test', (req, res) => {
    console.log('end')
    res.send('Success with the proxy')
})

router.post('/uploadpost', upload.single('userphoto'), (req, res) => {



    if(req.file === undefined){

        return res.status(422).json({ errors: 'LookID only supports the following file types - .png, .jpg, and .jpeg"' })
    }

    console.log(itemErrors.isEmpty())
    console.log(itemErrors.mapped());

    console.log(req.file)
    console.log(req.body)
    

    res.json({sun:'sending back the confirmation'})
    
    
})


module.exports = router;