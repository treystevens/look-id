const router = require('express').Router();
const models = require('../models/schemas');


// Initial load of user's Post, get 5 comments if available
router.get('/:user/:postid', (req, res) => {
    
    models.Posts.findOne({'post_id': req.params.postid}).populate({path: 'comments._user', model:'user', select:'profile.avatar username' }).exec()
    .then((data) => {

        if(!data) return Promise.reject(new Error('Had a problem with loading comments for this post.'));

        const commentsForPost = data.comments;
        res.json({comments: commentsForPost});
    })
    .catch((err) => {
        res.status(500).json({error: err});
        console.log(err);
    });
});

// User comments on post 
router.post('/', (req, res) => {

    // If user submits empty comment
    if(req.body.newComment.comment === ''){
        res.status(411).json({success: false});
    }

    const query = {
        "post_id": req.body.userPage.postID
    }; 

    // Find my document in database and get ID
    models.Users.findOne({username: req.user.username})
    .then((user) => {
        
        return user.id;
    })
    .then((userID) => {

        // Store my ID into new comment for reference (populate)
        const newComment = {
            _user: userID,
            date_posted: req.body.newComment.date_posted,
            comment: req.body.newComment.comment
        };

        // Push new comment into post that was commented on
        return models.Posts.findOneAndUpdate(query, {$push: {comments: newComment}});
        
    })
    .then(() => {

        // Query for the new comment on that post
        return models.Posts.findOne(query).populate({path: 'comments._user', model:'user', select:'profile.avatar username' }).exec();
    })
    .then((data) => {
        
        // Get the comment from the query
        const databaseComments = data.comments;
        const length = data.comments.length;
        const newComment = databaseComments[length-1];
        
        res.json({success: true, comment: newComment});
    })
    .catch((err) => {
        res.json({error: err});
        console.log(err);
    });
});

// User deletes a comment
router.post('/delete', (req, res) => {


    const query = { 'comments._id': req.body.id}; 

    // See if the user wanted to delete is authorized to delete comment
    models.Posts.findOne(query, { 'comments.$._id': 1, username: 1 })
    .then((post) => {

        let masterUser;
        let visitingUser;
        
        if(req.user.username === post.username) masterUser = true;
        if(req.user.id == post.comments[0]._user) visitingUser = true;

        // Pull comment out of post
        if(masterUser || visitingUser){
            return models.Posts.update(query, { $pull: { 'comments': { "_id":req.body.id }}});
        }
        else{
            return Promise.reject(new Error('You\'re not authorized to delete that comment.'));
        }
        
    })
    .then( () => {
        res.status(200).json({success: true});
    })
    .catch((err) => {
        res.status(401).json({error: err.message});
        console.log(err);
    });


    // have a username is isauth sent
    // if the username = req.user.username we good to delete comment
    // if is isatuh its good to delete any comment as long as the page they were on is rqual to req.user.usernam
});


module.exports = router;