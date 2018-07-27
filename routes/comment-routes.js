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
        return res.status(411).json({error: 'Please enter a message.'});
    }

    const query = {
        "post_id": req.body.userPage.postID
    }; 

    const recipient = req.body.userPage.username;
    

    // Store my ID into new comment for reference (populate)
    const newComment = {
        _user: req.user.id,
        date_posted: req.body.newComment.date_posted,
        comment: req.body.newComment.comment
    };


    // Push new comment into post that was commented on and push notification to user
    models.Posts.findOneAndUpdate(
        query, 
        { $push: { comments: newComment } },
        { new: true } )

    .then((post) => {

        // Query for the new comment on that post
        const newCommentQuery = models.Posts.findOne(query).populate({path: 'comments._user', model:'user', select:'profile.avatar username' }).exec();

        // If we make a comment on our own post avoid sending notification
        if(req.user.username === recipient) return newCommentQuery;
        
        const comments = post.comments;
        const index = comments.length - 1;
        const lastCommentID = comments[index].id;

    
        // Create a new notification
        const notification = {
            action: 'COMMENT',
            viewed: false,
            _user: req.user.id,
            _post: post.id,
            _comment: lastCommentID

        };
        const pushNotification = models.Users.update(
            { username: recipient }, 
            { $push: 
                { 
                    notifications: {
                        $each: [notification],
                        $position: 0
                    } 
                } 
            });
        

        return Promise.all([
            pushNotification,
            newCommentQuery
        ]);
    })
    .then((results) => {

        let commentData = results;
        // If we return Promise.all from previous then
        if(results.length) commentData = results[1];
        

        // Get the comment from the query
        const databaseComments = commentData.comments;
        const length = commentData.comments.length;
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
    let masterUser;
    let visitingUser;

    // See if the user wanted to delete is authorized to delete comment
    models.Posts.findOne(query, { 'comments.$._id': 1, username: 1 })
    .then((post) => {
        
        if(req.user.username === post.username) masterUser = true;
        if(req.user.id == post.comments[0]._user) visitingUser = true;

        // Pull comment out of post
        if(masterUser || visitingUser){
            const pullComment = models.Posts.update(query, 
                { $pull: { 'comments': { "_id": req.body.id } } });

            const getNotificationID = models.Users.findOne(
                { 'notifications._comment': req.body.id  }, {'notifications.$': 1});

                return Promise.all([
                    pullComment,
                    getNotificationID
                ]); 

        }
        else{
            return Promise.reject(new Error('You\'re not authorized to delete that comment.'));
        }
        
    })
    .then((results) => {

        // If we're deleting our own comment, skip pulling notification
        if(masterUser === visitingUser) return Promise.resolve(results); 

        // Pull notification from user's notification's list
        const notificationID = results[1].notifications[0].id;
        return models.Users.findOneAndUpdate(
            { 'notifications._id': notificationID },
            { $pull: { notifications: { '_id': notificationID } } }
        );
        
        
    })
    .then(() => {
        res.status(200).json({success: true});
    })
    .catch((err) => {
        res.status(401).json({error: err.message});
        console.log(err);
    });
});


module.exports = router;