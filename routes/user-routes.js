const router = require('express').Router();
const AccountInfo = require('../models/accInfo');
const User = require('../models/user');
const models = require('../models/schemas');


// User's Main Profile Page
router.get('/:user', (req, res) => {
    

    const query = {
       username: req.params.user
   };
   

   models.Users.findOne(query)
   .then( (user) => {

        if(!user) res.status(404).send('Page does not exist');

        let iFollow = false;

       if(req.isAuthenticated()){
            for(let me of user.followers){
        
                if(req.user.username === me.username){
                    iFollow = true;
                    
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
           iFollow: iFollow
       };


        models.Posts.find(query).then((data) => {

            neededData.posts = data;

            console.log(data);
            res.json({success: true, user: neededData});
        });
              

       
   })
   .catch( (err) => {
       res.json({success: false});
       console.log(err);
   });

});

// User's Post Page
router.get('/:user/:postid', (req, res) => {
    const query = {
       username: req.params.user
    };
    const postID = req.params.postid;


    // Search through all the user's post to get the specific post and to create 'Other Posts' section
    models.Posts.find(query).then((posts) => {

        let requestedPostData;
       
        // Get the needed post
        posts.forEach((post) => {
            if(post.post_id === postID){
                if(!post.post_id) res.status(404).send('Page does not exist');
                requestedPostData = post;
            }
        });

        // Make 'Other Posts' Section, filter out the post that is requested
        // const otherPosts = posts.filter((post) => post.post_id !== postID);
        models.Posts.find({post_id: {$ne: postID}}, {post_id: 1, image: 1})
        .then((otherPosts) => {
            res.json({post: requestedPostData, otherPosts: otherPosts});
        });
        
        
        
       
   })
   .catch( (err) => {
        console.log(err);
        res.status(415).json({success: false});
   });

});

// Get User's Like
router.get('/:user/:postid/likes', (req, res) => {

    const query = {
       post_id: req.params.postid
    };
    
    // Get requested posts for likes
    models.Posts.findOne(query).then((posts) => {

        let iLiked = false;
        const likeCount = posts.likes.length;

        // Check to see if user liked the requested post already
        if(req.isAuthenticated()){
            posts.likes.forEach((username) => {
                if(req.user.username === username) iLiked = true;
            });
        }

        res.json({iLiked: iLiked, likeCount: likeCount});
   })
   .catch( (err) => {
        console.log(err);
        res.status(500).json({success: false});
   });

});

// Liking a user's post
router.post('/:user/:postid/likes', (req, res) => {

    const query = {
        'post_id': req.params.postid
    };
    const liked = req.body.iLiked;
    let performUpdateAction;

    liked ? 
            performUpdateAction = { $pull: {'likes': req.user.username} } 
            : 
            performUpdateAction = { $push: {'likes': req.user.username} }

    

    models.Posts.findOneAndUpdate(query, performUpdateAction, {'new': true})
    .then(() => {
        res.json({success: true});
    })
    .catch((err) => {
        res.status(500).json({success: false});
        console.log(err);
    });

});

// For length of followers
// router.get('/:user/followers', (req, res) => {
    
//     const query = {
//         username: req.params.username
//     };

//     models.Users.findOne(query, {followers: 1})
//     .then((data) => {
//         console.log(data);
//     })
//     .catch((err) => {
//         console.log(err);
//     });


// });

// User following another user
router.post('/:user/followers', (req, res) => {
    
    const query = {
        username: req.params.user
    };
    const myUserName = req.user.username;
    const userIWantToFollow = req.params.user;

    let myFollowingAction;
    let updateAction;


    // If I follow them already pull their name from their follower list and my following list
    if(req.body.iFollow){
        updateAction = {$pull: {followers: myUserName} };
        myFollowingAction = {$pull: {following: userIWantToFollow} };
    }
    else{
        updateAction = {$push: {followers: myUserName} };
        myFollowingAction = {$push: {following: userIWantToFollow} };
    }
            

    // Go to the user I want to follow and add my data to their follower array
    models.Users.findOneAndUpdate(query, updateAction)
    .then(() => {
        // Add user's data to my following array
        models.Users.findOneAndUpdate({username: req.user.username}, myFollowingAction)
        .then(() => {

            const prevFollowingData = req.body.iFollow;
            let nowFollowing;
           
            prevFollowingData ? nowFollowing = false : nowFollowing = true;
            res.json({actionSuccess: true, iFollow: nowFollowing});
        });
        
    })
    .catch((err) => {

        console.log(err);
    });


});

// Getting list of users of followers (MODAL DISPLAY)
router.get('/:user/ff/followers', (req, res) => {
    
    const query = {
        username: req.params.user
    };

    // Projection
    const filterFollowers = { followers: 1 };
    const filterFollowing = { following: 1};
    
    // Find the user whose followers we'd like to view, project only their followers
    models.Users.findOne(query, filterFollowers)
    .then((data) => {

        console.log(data.followers);
        
        // Place the usernames into our array
        const followers = data.followers.map((username) => username);

        // Find those users and only project their username and avatar
        models.Users.find({username: {$in: followers}}, {username: 1, 'profile.avatar':1})
        .then((result) => {
            console.log(result.following, `result trying the map`)


            // models.Users.find({username: req.user.username}, {filterFollowing})
            // .then((following) => {

                // for(let i = 0; i < followers.length; i++){

            //             for(let j = 0; j < myFollowing.following.length; j++){
        
        
            //                 if(data.followers[i].username === myFollowing.following[j].username){
            //                     data.followers[i].iFollow = true;
            //                 }
            //             }
            //         }

            // });
            // Get my following data



            


            res.json({ff: result});
        });


            // By sorting can probably speed this up
        //   

        
        // Query my following list to see if there are users that I already follow in another user's followers list
        // models.Users.findOne({username: req.user.username}, filterFollowing)
        // .then((myFollowing) => {
 
        
    
        //     res.json({ff: data});
        // });
    })
    .catch((err) => {
        console.log(err);
    });


});

// Getting list of users of following (MODAL DISPLAY)
router.get('/:user/ff/following', (req, res) => {
    

    const query = {
        username: req.params.user
    };
    const filterFollowing = { following: 1};


    models.Users.findOne(query, filterFollowing)
    .then((data) => {

        
        
        // Place the usernames into our array
        const following = data.following.map((username) => username);

        // Find those users and only project their username and avatar
        models.Users.find({username: {$in: following}}, {username: 1, 'profile.avatar':1})
        .then((result) => {
            console.log(result, `result trying the map`)

            res.json({ff: result});
        });



    })
    .catch((err) => {
        console.log(err);
    });



});


// router.get('/:user/ff/:followers', (req, res) => {
    
//     const query = {
//         username: req.params.user
//     };

//     let projection;
    

//     if(req.params.follow === 'followers') projection = { followers: 1 };
//     if(req.params.follow === 'following') projection = { following: 1};
//     if(!req.params.follow) res.json({success: false});
    

//     AccountInfo.findOne(query, projection)
//     .then((data) => {
        

    

//         res.json({ff: data});

//     })
//     .catch((err) => {
//         console.log(err);
//     });


// });

module.exports = router;