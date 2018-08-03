const router = require('express').Router();
const models = require('../models/schemas');


// User's Main Profile Page
router.get('/:user/page/:page', (req, res) => {
    

    const query = {
       username: req.params.user
   };
   const skipNum = req.params.page * 10;
   let userData;
   let iFollow;
   let hasMore;

   // Retrieving user's profile information
   models.Users.findOne(query)
   .then( (user) => {

        if(!user) return Promise.reject(new Error('Sorry, this profile isnt available.'));

        // For the FollowButton component to see if I follow the user
        iFollow = false;
        if(req.isAuthenticated()){
            for(let me of user.followers){
                if(req.user.username === me){
                    iFollow = true;
                }
            }
        }
        
        // Send back to the client
        userData = {
           followerCount: user.followers.length,
           followingCount: user.following.length,
           bio: user.profile.bio,
           website: user.profile.website,
           avatar: user.profile.avatar,
           username: user.username
       };

        // Getting the user's posts
        return models.Posts.find(query).sort({timestamp: -1}).skip(skipNum).limit(10).exec();
        
   })
   .then( (posts) => {

        if(posts.length < 10) hasMore = false;
        else{
            hasMore = true;
        }
       
        res.json({success: true, user: userData, stream: posts, iFollow: iFollow, hasMore: hasMore });
    })
   .catch( (err) => {
       res.status(404).json({error: err});
       console.log(err);
   });

});

// User's Post Page
router.get('/:user/:postid', (req, res) => {


    const postID = req.params.postid;
    const paramUser = req.params.user;

    const postQuery = {
        post_id: postID
    };
    let requestedPost;

    // Check if the user is requesting a valid url
    const postExists = models.Posts.findOne(postQuery);
    const userExists = models.Users.findOne({username: paramUser});

    Promise.all([ postExists, userExists ])
    .then( (results) => {

        if(
            !results[0] ||  
            !results[1] ||
            (paramUser !== results[0].username)

            ) return Promise.reject(new Error('Sorry, this page isn\'t available.'));

        // Get post along with its items
        return models.Posts.findOne(postQuery).populate('items');
   })
    .then((post) => {
        
        if(!post) return Promise.reject(new Error('Post not found.'));

        requestedPost = post;

        // Make 'Other Posts' Section, filter out the post that is requested
        return models.Posts.find(
                { username: req.params.user, post_id: { $ne: postID } },
                { post_id: 1, image: 1 }
            );
   })
   .then((results) => {
        res.json({post: requestedPost, otherPosts: results});
    })
   .catch( (err) => {
        console.log(err);
        res.status(404).json({error: err});
   });

});

// User's Post Edit Page
router.get('/:user/:postid/edit', (req, res) => {


    const postID = req.params.postid;
    const paramUsername = req.params.user;
    const username = req.user.username;

    const postQuery = {
        post_id: postID
    };


    if(username !== paramUsername) res.status(401).json({error: 'Sorry, this page isn\'t available.'});
    

    models.Posts.findOne(postQuery).populate('items')
    .then((post) => {
        
        if(!post) return Promise.reject(new Error('Something went wrong trying to find your post.'));

        res.json({post: post});
   })
   .catch( (err) => {
        console.log(err);
        res.status(404).json({error: err});
   });
});

// Edit User's Post
router.post('/:user/:postid/edit', (req, res) => {

    
    // Schema has item price stored as string
    // Making sure price is a number
    const copyItems = req.body.items.map((item) => {

        item.price = parseInt(item.price) + '';
        if(isNaN(item.price)) item.price = '';
        return item;
    });


    const postID = req.params.postid;
    const postQuery = {
        post_id: postID
    };
    const caption = req.body.caption;
    const items = copyItems;

    const username = req.user.username;
    const paramUsername = req.params.user;

    if(username !== paramUsername) res.status(401).json({error: 'You\'re not authorized to perform action.'});

    models.Posts.findOne(postQuery)
   .then( (post) => {

        if(!post || (username !== post.username)) return Promise.reject(new Error('Make sure that the link is not broken. Can\'t seem to update this post.'));

        // Get post and create 'Other Posts' section
        return  models.Posts.findOneAndUpdate(postQuery, { $set: { caption: caption } } );
   })
    .then((post) => {

        const itemID = post.items;

        return models.Items.findByIdAndUpdate(
            itemID, 
            { $set: {items: items} } 
        );
   })
   .then(() => {
        res.status(200).json({success: true});
    })
   .catch( (err) => {
        console.log(err);
        res.status(500).json({error: err});
   });

});

// Delete User's Post
router.delete('/:user/:postid', (req, res) => {


    const postQuery = {
        post_id: req.params.postid
    };
    const username = req.user.username;

    

    models.Posts.findOne(postQuery)
    .then((post) => {
        
        if(username !== post.username){
            return Promise.reject(new Error('You\'re not authorized to delete post.'));
        } 

        // Remove a user's post from 
        // Posts - Feed - Boards - Explore - Items
        return models.Posts.findOneAndRemove(postQuery);
    })
    .then((post) => {

        const postID = post._id;

        const itemRemove = models.Items.findByIdAndRemove(post.items);
        const feedRemove = models.Feed.update(
            { },
            { $pull: {feed_items: postID } },
            { multi: true }
        );
        const boardRemove = models.Users.update(
            { 'boards.posts': postID },
            { $pull: { 'boards.$.posts': postID } },
            { multi: true }
        );
        const exploreRemove = models.Explore.findOneAndRemove({ 'post': postID });
       

        return Promise.all([itemRemove, feedRemove, boardRemove, exploreRemove]);
    })
    .then(() => {
    res.status(200).json({success: true});
    })
   .catch( (err) => {
        console.log(err);
        res.status(401).json({error: err});
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
        res.status(500).json({error: err});
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


    if(!req.isAuthenticated()) return res.status(401).json({error: 'You\'re not authorized to perform action.'});

    models.Posts.findOneAndUpdate(query, performUpdateAction, {new: true})
    .then((post) => {


        const notification = {
            action: 'LIKE',
            viewed: false,
            _user: req.user._id,
            _post: post.id
        };


        // If previously liked, find notification _id to pull notification
        if(liked) {

            // Make sure we're not pulling any notification when we like our own post
            if(req.user.username === post.username) return Promise.resolve(liked);

            return Promise.all([
                liked, 
                models.Users.findOne(
                    { 'notifications._user': req.user.id, 'notifications._post': post.id, 'notifications.action': 'LIKE' }, {'notifications.$': 1})
            ]);
        }
        // If previously did not like, send new notification
        else{

            // Make sure we're not sending notification when we like our own post
            if(req.user.username === post.username) return Promise.resolve(liked);

            return Promise.all([
                liked, 
                models.Users.update(
                    { username: req.params.user }, 
                    { $push: 
                        { 
                            notifications: {
                                $each: [notification],
                                $position: 0
                            } 
                        } 
                    })
            ]);
        }

    })
    .then((results) => {
        
  
        if(results.length && results[0]){
            // Remove notification
 
            const notificationID = results[1].notifications[0]._id;

            return models.Users.findOneAndUpdate(
                { 'notifications._id': notificationID },
                { $pull: { notifications: { '_id': notificationID } } },
                { new: true }
            );
        }

        return Promise.resolve(results);

    })
    .then(() => {
        
        res.json({success: true});
    })
    .catch((err) => {
        res.status(500).json({error: err});
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

    if(!req.isAuthenticated()) return res.status(401).json({error: 'You\'re not authorized to perform action.'});

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
        // Get notificaton ID just in case we need to pull the notification from the user's notification list
        const findPosts = models.Posts.find(query, {_id: 1});
        const getNotificationID = models.Users.findOne({ username: req.params.user ,'notifications._user': req.user.id, 'notifications.action': 'FOLLOW' }, {'notifications.$': 1});

        return Promise.all([
            findPosts,
            getNotificationID
        ]);
    })
    .then((results) => {

        const postIDs = results[0];
       
        // Pull ids if we no longer follow
        if(req.body.iFollow && results[1]){
            
            const notificationID = results[1].notifications[0].id;

            // Pull out the post ids and notification
            return Promise.all([
                models.Feed.findOneAndUpdate(
                    { username: req.user.username},
                    { $pull: { feed_items: { $in: postIDs } } }
                ),
                models.Users.findOneAndUpdate(
                    { 'notifications._id': notificationID },
                    { $pull: { notifications: { '_id': notificationID } } },
                    { new: true }
                )
            ]);
        }
        else{

            // Create a new notification
            const notification = {
                action: 'FOLLOW',
                viewed: false,
                _user: req.user._id
            };

            // Push in new ids if we now follow and sort the array
            // Push in new notification
            return Promise.all([
                models.Feed.findOneAndUpdate(
                { username: req.user.username},
                { $push: { feed_items: { $each: postIDs, $sort: -1 } } }),

                models.Users.update(
                    { username: req.params.user }, 
                    { $push: 
                        { 
                            notifications: {
                                $each: [notification],
                                $position: 0
                            } 
                        } 
                    })
            ]);
        }
    

    })
    .then(() => {
        res.json({actionSuccess: true, iFollow: nowFollowing});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({error: err});
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
    
    let usersFollowers;
    
    // Find the user whose followers we'd like to view, project only their followers
    models.Users.findOne(query, filterFollowers)
    .then((user) => {
        
        // Place the usernames into our array (LIST OF USERNAMES)
        const followers = user.followers.map((username) => username);

        // Find those users and only project their username and avatar
       return models.Users.find({username: {$in: followers}}, {username: 1, 'profile.avatar':1});
    })
    .then((result) => {

        // (LIST OF USER DOCUMENTS)
        usersFollowers = result.map( (user) => user.toObject());
        
        // Query for the users that I follow
       return models.Users.findOne({username: req.user.username}, filterFollowing);  
    })
    .then((data) => {
        
        const myFollowing = data.following;
        const iFollowData = seeIfIFollow(usersFollowers, myFollowing);

        res.json({ff: iFollowData});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({error: err});
    });


});

// Getting list of users of following (MODAL DISPLAY)
router.get('/:user/ff/following', (req, res) => {


    const query = {
        username: req.params.user
    };

   // Projection
   const filterFollowing = { following: 1 };

   let usersFollowing;
   
   // Find the user whose followers we'd like to view, project only their followers
   models.Users.findOne(query, filterFollowing)
   .then((user) => {
       
       // Place the usernames into our array
       const following = user.following.map((username) => username);

       // Find those users and only project their username and avatar
       return models.Users.find({username: {$in: following}}, {username: 1, 'profile.avatar':1});
       
    })
    .then((result) => {

        usersFollowing = result.map( (user) => user.toObject());

        // Check if I'm viewing my own Following list
        if(req.user.username === req.params.user){
            usersFollowing.forEach((user) => user.iFollow = true);

            res.json({ff: usersFollowing});
            return 1;
        }
        
        // Query for the users that I follow
        return models.Users.findOne({username: req.user.username}, filterFollowing);
   })
   .then((data) => {

        if(!data) return Promise.reject(new Error('Currently not following anybody.'))
        const myFollowing = data.following;
        const iFollowData = seeIfIFollow(usersFollowing, myFollowing);

        res.json({ff: iFollowData});
    })
   .catch((err) => {
       console.log(err);
       res.status(500).json({error: err});
   });


});

// Get intial notifications
router.put('/notifications', (req, res) => {


    const username = req.user.username;
    const query = {
        username: username
    };

    // Set the notifications to viewed
    models.Users.update(
        query, 
        { $set: { 'notifications.$[elem].viewed': true } },
        {
            arrayFilters: [ { 'elem.viewed': false } ]
        }
    )
    .then(() => {
        res.status(200).json({success: true});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({error: err});
    });

});

// Infinite scroll for notifications
router.get('/notifications/v/:page', (req, res) => {

    const username = req.user.username;
    const query = {
        username: username
    };

    const skipNum = req.params.page * 10;

   
    models.Users.findOne(query, {notifications: 1}).populate({path: 'notifications._user', select:'profile.avatar username'}).populate({path: 'notifications._post', select: 'image post_id'}).populate({path: 'notifications._comment', model:'post'}).exec()
    .then((user) => {
        
        if(!user) return Promise.reject(new Error('No notifications.'));

        const notifications = user.notifications.splice(skipNum, 10).map(notification => notification);
        let hasMore = true;
        if(notifications.length < 10) hasMore = false;
        
        res.status(200).json({notifications: notifications, hasMore: hasMore});
    })
    .catch((err) => {
        console.log(err);
        res.status(204).json({error: err});
    });

});

// Check to see if there are new notifications (NotificationIcon)
router.get('/notifications-check', (req, res) => {

    const username = req.user.username;
    const query = {
        username: username
    };

    models.Users.findOne(query, {notifications: 1})
    .then((data) => {
        if(!data) return Promise.reject(new Error('No notifications.'));

        let newNotifications;

        for(let check of data.notifications){
            if(!check.viewed) newNotifications = true;
        }
        res.json({newNotifications: newNotifications});
    })
    .catch((err) => {
        console.log(err);
        res.status(204).json({error: err});
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