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

    let alreadyFollow = false;

       if(req.isAuthenticated()){
            for(let me of user.followers){
                console.log(me, `mweeee`)
                if(req.user.username === me.username){
                    alreadyFollow = true;
                    console.log('were true')
                }
            }
        }

       const neededData = {
           followerCount: user.followers.length,
           followingCount: user.following.length,
           bio: user.profile.bio,
           website: user.profile.website,
           avatar: user.profile.avatar,
           posts: user.posts,
           username: user.username,
           alreadyFollowing: alreadyFollow
       };

       console.log(`==========GET REQUEST FOLLOWERS=======`)
       console.log(user.followers)
       console.log(user.following)
       
       

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

        if(req.isAuthenticated()){
            res.json({post: neededPostData, username: username, myUsername: req.user.username, otherPosts: user.other_posts});
        }
        else{
            res.json({post: neededPostData, username: username, otherPosts: user.other_posts});
        }

       
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

    // res.json({success: false})


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


router.get('/:user/followers', (req, res) => {
    
    const query = {
        username: req.params.username
    };

    AccountInfo.findOne(query, {followers: 1})
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err);
    });


});

router.post('/:user/followers', (req, res) => {
    
    const query = {
        username: req.params.user
    };

    const myUserData = {
        username: req.user.username,
        avatar: req.body.myUserData.avatar
    };

    const addUser = {
        username: req.params.user,
        avatar: req.body.userToFollow.avatar
    };

    let myFollowingAction;

    let updateAction;


    if(req.body.myUserData.isFollowing){
        updateAction = {$pull: {followers: myUserData} };
        myFollowingAction = {$pull: {following: addUser} };
        
    }
    else{

        updateAction = {$push: {followers: myUserData} };
        myFollowingAction = {$push: {following: addUser} };
    }
            


    // Go to user profile add my data to their follower array
    AccountInfo.findOneAndUpdate(query, updateAction, {new: true})
    .then((data) => {

        // Add user's data to my following array
        AccountInfo.findOneAndUpdate({username: req.user.username}, myFollowingAction, {new: true})
        .then((data) => {

            let nowFollowing;
            const prevFollowingData = req.body.myUserData.isFollowing;

            // If we previously followed, we don't now
            prevFollowingData ? nowFollowing = false : nowFollowing = true;


            res.json({actionSuccess: true, isFollowing: nowFollowing});
        });
        
    })
    .catch((err) => {
        console.log(err);
    });


});


router.get('/:user/ff/followers', (req, res) => {

    console.log('got followers')
    
    const query = {
        username: req.params.user
    };

    let projection = { followers: 1 };
    let secondProjection = { following: 1};
    


    AccountInfo.findOne(query, projection)
    .then((data) => {

         

        AccountInfo.findOne({username: req.user.username}, secondProjection)
        .then((myFollowing) => {
 


            // By sorting can probably speed this up
            for(let i = 0; i < data.followers.length; i++){

                for(let j = 0; j < myFollowing.following.length; j++){


                    if(data.followers[i].username === myFollowing.following[j].username){
                        data.followers[i].iFollow = true;
                    }
                }
            }
    
            
    
            res.json({ff: data});
        });

    })
    .catch((err) => {
        console.log(err);
    });


});

router.get('/:user/ff/following', (req, res) => {
    
    const query = {
        username: req.params.user
    };

    let projection = { following: 1};
    

    AccountInfo.findOne(query, projection)
    .then((data) => {
        let test = data;
        
        
        for(let user of data.following){
            
            user.iFollow = true;
        }

        

        res.json({ff: data});

    })
    .catch((err) => {
        console.log(err);
    });


});

router.get('/:user/followers', (req, res) => {
    
    const query = {
        username: req.params.user
    };

    let projection;
    

    if(req.params.follow === 'followers') projection = { followers: 1 };
    if(req.params.follow === 'following') projection = { following: 1};
    if(!req.params.follow) res.json({success: false});
    

    AccountInfo.findOne(query, projection)
    .then((data) => {
        

    

        res.json({ff: data});

    })
    .catch((err) => {
        console.log(err);
    });


});

module.exports = router;