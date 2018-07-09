const router = require('express').Router();

const AccountInfo = require('../models/accInfo');


// Get Boards from user
router.get('/', (req, res) => {

    const query = {
        username: req.user.username
    };

    AccountInfo.findOne(query)
    .then((user) => {
        res.json({boards: user.boards});  
    })
    .catch((err) => {
        console.log(err);
    });


    console.log(req.body);
    
});

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
        // username: req.user.username,
        name: req.body.boardName,
        display_image: '',
        board_posts: []
    };

    if(req.body.boardImage) newBoard.display_image = req.body.boardImage;

    AccountInfo.findOneAndUpdate(query, {$push: {boards: newBoard}}, {'new': true})
    .then((user) => {

        const boardsLength = user.boards.length;

        const newUserBoard = user.boards[boardsLength - 1];
        console.log(newUserBoard);

        res.json({boards: newUserBoard});
        
    })
    .catch((err) => {
        console.log(err);
    });

});


router.post('/addpost', (req, res) => {
    
    const query = {
        'boards.board_id': req.body.boardID
    };

    const postToAdd = {
        username: req.body.username,
        post: {
            post_id: req.body.postID,
            image: req.body.postImage
        }
    };

    AccountInfo.findOneAndUpdate(query, {$push: {'boards.$.images': postToAdd}})
    .then(() => {

        // Update the board display image with new image
        AccountInfo.findOneAndUpdate(query, {$set: {'boards.$.display_image': postToAdd.post.image}})
        .then(() => {
            res.json({success: true});
        });
        
    })
    .catch((err) => {
        res.json({success: false});
        console.log(err);
    });
});


router.get('/:boardid', (req, res) => {
    
    const query = {
        'boards.board_id': req.params.boardid
    };

    AccountInfo.findOne(query, {'boards.$.images': 1})
    .then((response) => {
        console.log(response);

        const boardImages = response.boards[0].images;
        const boardName = response.boards[0].name;

        res.json({stream: boardImages, username: boardName});

    })
    .catch((err) => {
        console.log(err);
    });
});

module.exports = router;