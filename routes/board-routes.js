const router = require('express').Router();
const models = require('../models/schemas');


// Get Boards from user
router.get('/', (req, res) => {

    console.log(req.user);
    const query = {
        username: req.user.username
    };

    models.Users.findOne(query)
    .then((user) => {
        res.json({boards: user.boards});  
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({errors: 'Could not retrieve boards.'});
    });
});

// Creating a new board
router.post('/createboard', (req, res) => {

    // Create an ID for the board
    const usernameLength = req.user.username.length;
    const userASCII = req.user.username.charCodeAt(0) + req.user.username.charCodeAt(usernameLength - 1);
    const timestamp = Date.now();
    const boardID = `${userASCII}${timestamp}`;

    const query = {
        username: req.user.username
    };


    const newBoard = {
        board_id: boardID,
        name: req.body.boardName,
        display_image: '',
        posts: []
    };

    
    models.Users.findOneAndUpdate(query, {$push: {boards: newBoard}}, {'new': true})
    .then((user) => {

        const boardsLength = user.boards.length;
        const newUserBoard = user.boards[boardsLength - 1];

        res.json({boards: newUserBoard});
    })
    .catch((err) => {
        console.log(err);
        res.status(503).json({errors: 'Could not create board at the moment.'});
    });

});

// Adding a post to a board
router.post('/addpost', (req, res) => {
    
    const query = {
        'boards.board_id': req.body.boardID
    };

    const postToAdd = {
        post_id: req.body.postID,
    };


    // Query the post to get the _id to save into Board's 'posts' property
    models.Posts.findOne(postToAdd) 
    .then((post) => {
        console.log(post, `actual post`)
        const referenceToPost = post._id;
        // Check if the post exists in the board already
        // const checkPost = models.Users.findOne({'boards.posts': referenceToPost});
        const checkPost = models.Users.findOne(
            { boards: { $elemMatch: { board_id: req.body.boardID, posts: referenceToPost } }});

        // { results: { $elemMatch: { product: "xyz", score: { $gte: 8 } } } }
        // return referenceToPost;
        // console.log(referenceToPost, `reference to post`)

        return Promise.all([referenceToPost, checkPost]);
    })
    .then((results) => {


        
        // Does not exist inside board
        // Reference post was not already found inside the board - clear to add post to board
        if(results[1] === null){
            return models.Users.findOneAndUpdate(query, {$push: {'boards.$.posts': results[0]}});   
        }

        // The particular image is already inside the board the user would like to add to
        return Promise.reject('Post already exists inside board');
       
    
    })
    .then(() => {

        // Update the board display image with new image
        return models.Users.findOneAndUpdate(query, {$set: {'boards.$.display_image': req.body.postImage}});
    })
    .then(() => {
        res.json({success: true});
    })
    .catch((err) => {
        console.log(err);
        res.json({errors: err});
    });
});

// Get individual board (Infinite Scroll)
router.get('/:boardid/page/:page', (req, res) => {
    
    const query = {
        'boards.board_id': req.params.boardid
    };


    models.Users.findOne(query, {'boards.$.posts': 1}).populate({ path: 'boards.posts', populate: {path: 'posts', model: 'post'}, select: 'username image post_id' }).exec()
    .then((response) => {

        const skipNum = req.params.page * 10;
        const boardName = response.boards[0].name;
        const posts = response.boards[0].posts.splice(skipNum, 10);
        let hasMore;

        if(posts.length < 10) hasMore = false;
        else{
            hasMore = true;
        }

        res.json({stream: posts, boardName: boardName, hasMore: hasMore});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({errors: 'Failed to retrieve board.'});
    });
});

// Get individual board (Infinite Scroll)
router.get('/:boardid', (req, res) => {
    
    const query = {
        'boards.board_id': req.params.boardid
    };


    models.Users.findOne(query, {'boards.$.posts': 1}).populate({ path: 'boards.posts', populate: {path: 'posts', model: 'post'}, select: 'username image post_id' }).exec()
    .then((response) => {

        const boardName = response.boards[0].name;
        const posts = response.boards[0].posts;


        res.json({stream: posts, boardName: boardName});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({errors: 'Failed to retrieve board.'});
    });
});

// Get individual board
router.post('/:boardid/edit', (req, res) => {

    
    const query = {
        'boards.board_id': req.params.boardid
    };
    const listOfPostIDs = req.body.posts.map((post) => post.postID);
    const listOfPostImages = req.body.posts.map((post) => post.postImg);


    // If user is not authenticated
    if(!req.isAuthenticated()) res.status(402);

    // Update database on deleted posts or board name change
    const pullPosts = models.Users.findOneAndUpdate(
        query,  
        { $pull: { 'boards.$.posts': { $in: listOfPostIDs }   }  })
        .populate({ path: 'boards.posts', populate: {path: 'posts', model: 'post'}, select: 'username image post_id' }).exec();

    const changeName = models.Users.findOneAndUpdate(
        query,
        { 'boards.$.name': req.body.boardName}
    );

    Promise.all([pullPosts, changeName])
    .then(() => {

        // Query for document again and use $ to project the changed board
        return models.Users.find(query, {'boards.$': 1} ).populate({ path: 'boards.posts', populate: {path: 'posts', model: 'post'}, select: 'username image post_id' }).exec();
    })
    .then((result) => {

        const board = result[0].boards[0];
        const boardName = board.name;
        const posts = board.posts;
        let changeDisplay;


        // Check if a image that was requested to be deleted is the board's display image
        listOfPostImages.forEach((image) => {
            if(image === board.display_image) changeDisplay = true;
        });

        // One of the that was deleted is the same as the board's display image
        if(changeDisplay){

            // Empty string or a new post image for board display image
            let updateAction;

            if(posts.length === 0) updateAction = '';
            if(posts.length > 0) updateAction = posts[0].image;

            return models.Users.findOneAndUpdate(
                query,
                { 'boards.$.display_image': updateAction}
            );
        }

        // Post image was not the same as board display
        else{
            res.json({stream: posts, boardName: boardName});
        }
    })
    .then(() => {

        // Query for the specific board again
        return models.Users.find(query, {'boards.$': 1} ).populate({ path: 'boards.posts', populate: {path: 'posts', model: 'post'}, select: 'username image post_id' }).exec();
    })
    .then((result) => {
        
        const board = result[0].boards[0];
        const boardName = board.name;
        const posts = board.posts;

        res.json({stream: posts, boardName: boardName});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({errors: 'Failed delete posts from boards.'});
    });
});

// Delete an individual board
router.delete('/:boardid/delete', (req, res) => {

    const query = {
        'boards._id': req.params.boardid
    };

    if(!req.isAuthenticated()) res.status(402);

    models.Users.findOneAndUpdate(
        query,
        { $pull: { 'boards': {'_id': req.params.boardid } } }
    )
    .then(() => {
        res.json({success: true});
    })
    .catch((err) => {
        console.log(err);
        res.status(500).json({errors: 'Failed to delete board.'});
    });
});


module.exports = router;