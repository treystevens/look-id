const router = require('express').Router();
const TestExplore = require('../models/testexplore');
const models = require('../models/schemas');


// Route for global explore feed
router.get('/explore', (req, res) => {
    
    // Get documents back in the descending order
    models.Explore.find({}).populate('post').sort({_id:-1}).exec()
    .then((data) => {

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
        res.json({stream: posts});
    })
    .catch((err) => {
        console.log(err);
    });
});


// Route for a user's feed
router.get('/feed', (req, res) => {

    const query = {
        username: req.user.username
    };
    
    // Get user's feed items
    models.Feed.findOne(query).populate('feed_items').exec()
    .then((data) => {        

        // Sending back only necessary post information
        const posts = data.feed_items.map((post) => {
            const userPost = {
                _id: post.id,
                post_id: post.post_id,
                username: post.username,
                image: post.image
            };
            return userPost;
        });
        res.json({stream: posts});
    })
    .catch((err) => {
        console.log(err);
    });
});

module.exports = router;