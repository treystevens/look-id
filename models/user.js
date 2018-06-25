const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: String,
    password: String
});



// first argument is the collection name (singular)...remember it's plural in MongoDB
const User = mongoose.model('user', userSchema);

module.exports = User;