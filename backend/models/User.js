const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const articleSchema = new mongoose.Schema({
    title: String,
    description: String,
    url: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid URL`
        },
        required: [true, 'URL required']
    },
    urlToImage: {
        type: String,
        validate: {
            validator: function(v) {
                return /^(http|https):\/\/[^ "]+$/.test(v);
            },
            message: props => `${props.value} is not a valid image URL`
        }
    }
});

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^([\w-.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Please fill a valid email address']
    },
    password: { 
        type: String, 
        required: true,
        set: password => {
            if (password) {
                return bcrypt.hashSync(password, 10);
            } else {
                return password;
            }
        }
    },    
    name: { type: String, required: true },
    savedArticles: [articleSchema],
    searchHistory: [{
        type: String
    }]
});

module.exports = mongoose.model('User', userSchema);
