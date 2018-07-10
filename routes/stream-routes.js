const router = require('express').Router();
const TestExplore = require('../models/testexplore');



router.get('/explore', (req, res) => {
    
    TestExplore.find({})
    .then((response) => {
        console.log(response);
        console.log(response[0].stream);

        res.json({stream: response[0].stream});
    })
    .catch((err) => {
        console.log(err);
    });

});

module.exports = router;