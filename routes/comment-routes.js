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

 
    AccountInfo.findOneAndUpdate(query, {$push: {"posts.$.comments": req.body.newComment}}, {
        "new": true
       })
    .then( (data) => {
        AccountInfo.findOne(
            query, {"posts.$": 1})
            .then((data) => {
                console.log(data);

                const databaseComments = data.posts[0].comments;
                const length = data.posts[0].comments.length;

                const newComment = databaseComments[length-1];

                res.json({success: true, comment: newComment});

                
            });

    

        
        
    })
    .catch( (err) => {
        console.log(err);
    });

});


router.post('/delete', (req, res) => {
    
    const query = { "posts.comments._id": req.body.id}; 
    
    AccountInfo.update(query, { $pull: { 'posts.$.comments': {
        "_id":req.body.id}}})
    .then( () => {
        res.json({success: true});
    })
    .catch((err) => {
        console.log(err);
    });

})


module.exports = router;