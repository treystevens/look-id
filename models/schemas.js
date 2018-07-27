const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const userSchema = new Schema({
    username: String,
    password: String,
    profile: {
        bio: {type: String, default: ''},
        website: {type: String, default: ''},
        avatar: {type: String, default: 'https://res.cloudinary.com/dr4eajzak/image/upload/v1530898955/avatar/default-avatar.jpg'}
    },
    notifications: [{
        action: String, 
        _user: { type: Schema.Types.ObjectId, ref: 'user' }, 
        _post: { type: Schema.Types.ObjectId, ref: 'post' },
        _comment: { type: Schema.Types.ObjectId, ref: 'post' },
        viewed: Boolean
    }],
    following: [String],
    followers: [String],
    boards: [
        {
            board_id: String,
            name: String,
            display_image: String,
            posts: [{ type: Schema.Types.ObjectId, ref: 'post' }]
        }
    ]
});

const itemSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'post' },
    items: [{
        category: String,
        name: String,
        price: String,
        color: String,
        stores: [],
        link: String,
        thrifted: Boolean
    }],
});

const postSchema = new Schema({

    post_id: String,
    username: String,
    image: String,
    timestamp: { type: Date, default: Date.now },
    likes: [String],
    caption: String,
    comments: [{
        _user: { type: Schema.Types.ObjectId, ref: 'user' },
        date_posted: String,
        comment: String,
    }],
    items: { type: Schema.Types.ObjectId, ref: 'item' }
});

const exploreSchema = new Schema({
    post: { type: Schema.Types.ObjectId, ref: 'post' }
});

const feedSchema = new Schema({
    username: String,
    feed_items: [{ type: Schema.Types.ObjectId, ref: 'post' }]
                
});

const Users = mongoose.model('user', userSchema);
const Posts = mongoose.model('post', postSchema);
const Explore = mongoose.model('explore', exploreSchema);
const Feed = mongoose.model('feed', feedSchema);
const Items = mongoose.model('item', itemSchema);

module.exports = {
    Users: Users,
    Posts: Posts,
    Explore: Explore,
    Feed: Feed,
    Items: Items
};