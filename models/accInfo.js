const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const accountInfoSchema = new Schema({
    username: String,
    display_image: String,
    posts: [{
        post_id: String,
        caption: String,
        image: String,
        image_id: String,
        comments: [{
            username: String,
            user_id: String,
            date: { type: Date, default: Date.now },
            comment: String,
            user_display_image: String
        }],
        timestamp: String,
        items: [{
            category: String,
            name: String,
            price: String,
            stores: Array,
            online_link: String,
            description: String
        }]
    }],
    other_posts: [{ post_id: String, image: String }],
    followers: [Array],
    following: [Array],
    boards: [{
        id: String,
        name: String,
        display_image: String,
        user: String,
        images: [{
            username: String,
            post: {
                image: String,
                image_id: String
            }
        }]
    }],
    "notifications": [],
    "posts_liked": [{
        username: String,
        id: String,
        post_id: String
    }],
    "feed": [{
        username: String,
        id: String,
        post_id: String
    }]


}, {strict: false});

accountInfoSchema.add({ profile: {
    bio: 'string',
    website: 'string',
    avatar: 'string'
} });

// const AccountInfo = mongoose.model('accountinfo', accountInfoSchema);
const AccountInfo = mongoose.model('account', accountInfoSchema);



module.exports = AccountInfo;
