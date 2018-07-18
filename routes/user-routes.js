const router = require('express').Router();
const models = require('../models/schemas');


// User's Main Profile Page
router.get('/:user', (req, res) => {
    

    const query = {
       username: req.params.user
   };
   
   // Retrieving user's profile information
   models.Users.findOne(query)
   .then( (user) => {

        if(!user) res.status(404).send('Page does not exist');

        // For the FollowButton component to see if I follow the user
        let iFollow = false;
        if(req.isAuthenticated()){
            for(let me of user.followers){
                if(req.user.username === me){
                    iFollow = true;
                }
            }
        }

        // Send back to the client
        const userData = {
           followerCount: user.followers.length,
           followingCount: user.following.length,
           bio: user.profile.bio,
           website: user.profile.website,
           avatar: user.profile.avatar,
           username: user.username
       };

        // Getting the user's posts
        models.Posts.find(query)
        .then((posts) => {
            res.json({success: true, user: userData, stream: posts, iFollow: iFollow});
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
        models.Posts.find({username: req.params.user, post_id: {$ne: postID}}, {post_id: 1, image: 1})
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

    // Action we will do depending on if we liked the user's post or not
    liked ? 
            performUpdateAction = { $pull: {'likes': req.user.username} } 
            : 
            performUpdateAction = { $push: {'likes': req.user.username} }

    

    models.Posts.findOneAndUpdate(query, performUpdateAction)
    .then(() => {
        res.json({success: true});
    })
    .catch((err) => {
        res.status(500).json({success: false});
        console.log(err);
    });

});

// User following another user
router.post('/:user/followers', (req, res) => {
    
    const query = {
        username: req.params.user
    };
    const myUserName = req.user.username;
    const userIWantToFollow = req.params.user;

    let myFollowingAction;
    let updateAction;

    // Compare to see if I now follow the user now
    const prevFollowingData = req.body.iFollow;
    let nowFollowing;
    
    prevFollowingData ? nowFollowing = false : nowFollowing = true;


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
       return models.Users.findOneAndUpdate({username: req.user.username}, myFollowingAction);
    })
    .then(() => {
        // Search for the user's post to get ids to add to my feed_items
        return models.Posts.find(query, {_id: 1});        
    })
    .then((postIDs) => {

        console.log(postIDs, `the post IDS`);

        // Pull ids if we no longer follow
        if(req.body.iFollow){
            // $pull out the post ids
            return models.Feed.findOneAndUpdate(
                { username: req.user.username},
                { $pull: { feed_items: { $in: postIDs } } }
            );
        }
        // Push in new ids if we now follow and sort the array
        else{
            return models.Feed.findOneAndUpdate(
                { username: req.user.username},
                { $push: { feed_items: { $each: postIDs, $sort: -1 } } }
            );
        }
    })
    .then(() => {
        res.json({actionSuccess: true, iFollow: nowFollowing});
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
    const filterFollowing = { following: 1 };
    
    // Find the user whose followers we'd like to view, project only their followers
    models.Users.findOne(query, filterFollowers)
    .then((user) => {
        
        // Place the usernames into our array (LIST OF USERNAMES)
        const followers = user.followers.map((username) => username);

        // Find those users and only project their username and avatar
        models.Users.find({username: {$in: followers}}, {username: 1, 'profile.avatar':1})
        .then((result) => {

            // Shadow variable (LIST OF USER DOCUMENTS)
            const followers = result.map( (user) => user.toObject());
            
            // Query for the users that I follow
            models.Users.findOne({username: req.user.username}, filterFollowing).then((data) => {

                const myFollowing = data.following;
                const iFollowData = seeIfIFollow(followers, myFollowing);

                res.json({ff: iFollowData});
            })
            .catch((err) => {
                console.log(err);
            });
            
        });
        
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

   // Projection
   const filterFollowing = { following: 1 };
   
   // Find the user whose followers we'd like to view, project only their followers
   models.Users.findOne(query, filterFollowing)
   .then((user) => {
       
       // Place the usernames into our array
       const following = user.following.map((username) => username);

       // Find those users and only project their username and avatar
       models.Users.find({username: {$in: following}}, {username: 1, 'profile.avatar':1})
       .then((result) => {

            const following = result.map( (user) => user.toObject());

            // Check if I'm viewing my own Following list
            if(req.user.username === req.params.user){
                following.forEach((user) => user.iFollow = true);

                res.json({ff: following});
                return 1;
            }
            
            // Query for the users that I follow
            models.Users.findOne({username: req.user.username}, filterFollowing).then((data) => {

                const myFollowing = data.following;
                const iFollowData = seeIfIFollow(following, myFollowing);

                res.json({ff: iFollowData});
            })
            .catch((err) => {
                console.log(err);
            }); 
       }); 
   })
   .catch((err) => {
       console.log(err);
   });


});

// Create iFollow property
function seeIfIFollow(usersData, myData){
        
    if(myData.length < usersData.length){

        // Tracker will tell us to stop looping through the usersData once we found all of our matches. 
        const tracker = [];

        loop1: 
            for(let i = 0; i < usersData.length; i++){

                loop2:
                for(let j = 0; j < myData.length; j++){
                    // All the people that I follow are found in their followers list
                    if(tracker.length === myData.length){
                        break loop1;
                    }

                    // Continue loop once we find a match to help avoid unncessary looping
                    if(usersData[i].username === myData[j]){
                        
                        usersData[i].iFollow = true;
                        tracker.push(usersData[i].username);
                        continue loop1;
                    }
                }
            }
    }
    else{

        loop1: 
            for(let i = 0; i < usersData.length; i++){
                loop2:
                for(let j = 0; j < myData.length; j++){

                    // Continue loop once we find a match to help avoid unncessary looping
                    if(usersData[i].username === myData[j]){
                        
                        usersData[i].iFollow = true;
                        continue loop1;
                    }
                }
            }
    }

    // Return with the iFollow property on those I follow
    return usersData;
}

module.exports = router;