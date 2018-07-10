// I need post ID, username, link to photo

const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// const testExploreSchema = new Schema({
//     username: String,
//     stream : { type : Array , "default": [] }
// });

const testExploreSchema = new Schema({

    stream: [{
        username: String,
        post: {
            post_id: String,
            image: String
        }
    }]
    

});



const TestExplore = mongoose.model('testexplore', testExploreSchema);

module.exports = TestExplore;


// {
//     "username": "jknowlem",
//     "post": {
//         "image": "/lookid/fit1.jpg",
//         "post_id": "01"
//     } 
// },



// {
//     username: String
//     post : { type : Array , "default": [] }
// }
