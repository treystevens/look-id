const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    username: String,
    password: String,
    profile: {
        bio: String,
        website: String,
        avatar: {type: String, default: 'https://res.cloudinary.com/dr4eajzak/image/upload/v1530898955/avatar/default-avatar.jpg'}
    },
    notifications: [{
        action: String, 
        username: String,
        post_id: String,
        viewed: Boolean
    }]

});


const postSchema = new Schema({

    post_id: String,
    username: String,
    image: String,
    timestamp: { type: Date, default: Date.now },
    liked: [{
        username: String
    }],
    comments: [{
        username: String,
        date: String,
        comment: String,
    }]
});


const itemSchema = new Schema({
    post_id: String,
    items: [{
        category: String,
        name: String,
        price: String,
        stores: [String],
        online_link: String,
        description: String
    }],
});


const followingSchema = new Schema({
    username: String,
    following: [{
        username: String
    }]
});


const followerSchema = new Schema({
    username: String,
    followers: [{
        username: String
    }]
});


const exploreSchema = new Schema({
        username: String,
        post_id: String
});


const feedSchema = new Schema({
    username: String,
    feed_items: [{
        username: String,
        post_id: String, 
    }]
});


const boardSchema = new Schema({
    username: String,
    boards: [
        {
            board_id: String,
            name: String,
            display_image: String,
            images: [
                {
                    username: String,
                    post_id: String,
                    image: String
                }
            ] 
        }
    ]
    
});


const Users = mongoose.model('user', userSchema);
const Posts = mongoose.model('post', postSchema);
const Items = mongoose.model('item', itemSchema);
const Following = mongoose.model('following', followingSchema);
const Followers = mongoose.model('follower', followerSchema);
const Explore = mongoose.model('explore', exploreSchema);
const Feed = mongoose.model('feed', feedSchema);
const Boards = mongoose.model('board', boardSchema);


module.exports = {
    Users: Users,
    Posts: Posts,
    Items: Items,
    Following: Following,
    Followers: Followers,
    Explore: Explore,
    Feed: Feed,
    Boards: Boards
};