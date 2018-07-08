const router = require('express').Router();
const AccountInfo = require('../models/accInfo');



router.get('/:user/:postid', (req, res) => {
    
    AccountInfo.findOne({'posts': {$elemMatch: {post_id: req.params.postid}}}, {'posts.$': 1, '_id': 0})
    .then((data) => {


        let commentsForPost = data.posts[0].comments;

        console.log(commentsForPost)
        res.json({comments: commentsForPost});
    })
    .catch((err) => {
        console.log(err);
    });

});

router.post('/', (req, res) => {

    // Do validation to make sure the a submit cannot be made if the comment box is empty


    const query = {
        "posts.post_id": req.body.userPage.postID
    }; 

    console.log(req.body, `this is the request body`);
    // res.json({success: true})
 
    // Update the items for that specific post

    AccountInfo.findOneAndUpdate(query, {$push: {"posts.$.comments": req.body.newComment}}, {new: true})
    .then( (data) => {

        res.json({success: true, comment: req.body.newComment});
        
    })
    .catch( (err) => {
        console.log(err);
    });

});


module.exports = router;