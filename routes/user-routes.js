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

        console.log(user)

        const neededData = {
            followerCount: user.followers.length,
            followingCount: user.following.length,
            bio: user.profile.bio,
            website: user.profile.website,
            avatar: user.profile.avatar
        };

        res.json({user: neededData});
    })
    .catch( (err) => {
        console.log(err);
    });

});

module.exports = router;