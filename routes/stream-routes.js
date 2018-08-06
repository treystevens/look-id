const router = require('express').Router();
const models = require('../models/schemas');


// Route for global explore feed
router.get('/explore/:page', (req, res) => {
    
    const skipNum = req.params.page * 10;

    // Get documents back in the descending order
    models.Explore.find({}).populate('post').sort({_id:-1}).skip(skipNum).limit(10).exec()
    .then((data) => {

        if(!data) return Promise.reject(new Error('Seems like we couldn\'t find any posts.'));
        
        // Sending back only necessary post information
        const posts = data.map((post) => {
            const userPost = {
                _id: post.id,
                post_id: post.post.post_id,
                username: post.post.username,
                image: post.post.image
            };
            return userPost;
        });
        let hasMore;

        if(data.length < 10) hasMore = false;
        else{
            hasMore = true;
        }

        res.json({stream: posts, hasMore: hasMore});
    })
    .catch((err) => {
        console.log(err);
        res.status(204).json({error: err});
    });
});


// Route for a user's feed
router.get('/feed/:page', (req, res) => {
  

    if(!req.isAuthenticated()) return res.status(204).json({notAuth: 'Must be logged in to view Feed'});

    const query = {
        username: req.user.username
    };
    
    const skipNum = req.params.page * 10;


    
    // Get user's feed items
    models.Feed.findOne(query).populate('feed_items').exec()
    .then((data) => {  

        if(data.feed_items.length == 0) return res.status(200).json({doesFollowUsers: false});

        // Sending back only necessary post information
        const posts = data.feed_items.splice(skipNum, 10).map((post) => {
            const userPost = {
                _id: post.id,
                post_id: post.post_id,
                username: post.username,
                image: post.image
            };
            return userPost;
        });

        let hasMore;

        if(posts.length < 10) hasMore = false;
        else{
            hasMore = true;
        }

        res.json({stream: posts, hasMore: hasMore});
    })
    .catch((err) => {
        console.log(err);
        res.status(204).json({error: err});
    });
});

module.exports = router;