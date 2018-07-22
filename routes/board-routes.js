const router = require('express').Router();
const models = require('../models/schemas');


// Get Boards from user
router.get('/', (req, res) => {

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

        const referenceToPost = post._id;
        return referenceToPost;
    })
    .then((postID) => {

       return models.Users.findOneAndUpdate(query, {$push: {'boards.$.posts': postID}});

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
        res.status(500).json({errors: 'Could not add post to the board at the moment'});
    });
});

// Get individual board
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

// Get individual board
router.post('/:boardid/edit', (req, res) => {

    console.log(req.body.posts);
    
    const query = {
        'boards.board_id': req.params.boardid
    };

    if(!req.isAuthenticated()) res.status(402);

    

    const pullPosts = models.Users.findOneAndUpdate(
        query,  
        { $pull: { 'boards.$.posts': { $in: req.body.posts }   }  },
        {new: true}).populate({ path: 'boards.posts', populate: {path: 'posts', model: 'post'}, select: 'username image post_id' }).exec()

    const changeName = models.Users.findOneAndUpdate(
        query,
        { 'boards.$.name': req.body.boardName}, {new: true}
    );

    Promise.all([pullPosts, changeName])
    .then((response) => {

        console.log(response)
        const boardName = response[1].boards[0].name;
        const posts = response[0].boards[0].posts;

        console.log(boardName)
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