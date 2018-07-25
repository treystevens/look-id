const router = require('express').Router();
const models = require('../models/schemas');

// express-validator
const { validationResult } = require('express-validator/check');
const { body } = require('express-validator/check');


router.post('/:page', (req, res) => {


    const skipNum = req.body.page * 10;
    let priceValue = req.body.price;  
    let itemQuery = req.body.query;
    let colorValue = req.body.color;

    const query = {
        '$text': { '$search': itemQuery }
    };


    if(req.body.price !== '') {
        query['items.price'] = { $lte: priceValue };
    }
    if(req.body.color !== '') {
        query['items.color'] = colorValue ;
    }

    models.Items.find( 
        query 
    ).populate('post').sort({_id:-1}).skip(skipNum).limit(10).exec()
    .then((data) => {

        if(!data) return Promise.reject(new Error('Sorry, could not find anything matching your search.'));

        let hasMore;

        // Sending back only necessary post information
        const posts = data.map((user) => {
            const userPost = {
                _id: user.post.id,
                post_id: user.post.post_id,
                username: user.post.username,
                image: user.post.image
            };
            return userPost;
        });

        if(data.length < 10) hasMore = false;
        else{
            hasMore = true;
        }

        res.json({stream: posts, hasMore: hasMore});
    })
    .catch((err) => {
        console.log(err);
        res.status(204).json({error: err});
    });
});


module.exports = router;