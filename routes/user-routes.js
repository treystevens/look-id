const router = require('express').Router();
const AccountInfo = require('../models/accInfo');
const User = require('../models/user');


router.get('/:user', (req, res) => {
    // Display Pictures, followers, bio, avatar main profile page


    const query = {
       username: req.params.user
   };
   

   AccountInfo.findOne(query)
   .then( (user) => {

        if(!user) res.status(404).send('Page does not exist');

    //    console.log(user);

       const neededData = {
           followerCount: user.followers.length,
           followingCount: user.following.length,
           bio: user.profile.bio,
           website: user.profile.website,
           avatar: user.profile.avatar,
           posts: user.posts,
           username: user.username
       };

       res.json({user: neededData});
   })
   .catch( (err) => {
       console.log(err);
   });

});


router.get('/:user/:postid', (req, res) => {

    const query = {
       username: req.params.user
   };
    const postID = req.params.postid;


   AccountInfo.findOne(query)
   .then( (user) => {

    if(!user) res.status(404).send('Page does not exist');


       let neededPostData;

       user.posts.forEach((post) => {
        if(post.post_id === postID){
            if(!post.post_id) res.status(404).send('Page does not exist');
            neededPostData = post;
        }
       });

       console.log(neededPostData, ` the needed post data`);


        const username = user.username;

       res.json({post: neededPostData, username: username, myUsername: req.user.username, otherPosts: user.other_posts});
   })
   .catch( (err) => {
       console.log(err);
   });

});

router.post('/:postid/like', (req, res) => {

    const liked = req.body.liked;
    let performUpdateAction;

    liked ? 
            performUpdateAction = { $pull: {'posts.$.liked': req.user.username} } 
            : 
            performUpdateAction = { $push: {'posts.$.liked': req.user.username} }

    const query = {
        'posts.post_id': req.params.postid
    };

    res.json({success: false})
    AccountInfo.findOneAndUpdate(query, performUpdateAction, {'new': true})
    .then((post) => {
        AccountInfo.findOne(query, {'posts.$.liked': 1})
        .then((data) => {
            res.json({success: true});
        });
    })
    .catch((err) => {
        res.json({success: false});
        console.log(err);
    });

});


module.exports = router;