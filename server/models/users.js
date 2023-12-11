const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({

    username : {
        type: String,
        required : true
    },
    email : {
        type: String,
        required : true
    },
    password: {
        type: String,
        required: true
    },
    reputation: {
        type: Number,
        required: true,
        default: 0
    },
    register_date: {
        type: Date,
        required: true,
        default: Date.now()
    }
    // questions: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Question'
    // }],
    // answers: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Answer'
    // }],
    // tags: [{
    //     type: Schema.Types.ObjectId,
    //     ref: 'Tag'
    //}]


}, {collection: 'users'});

const User = mongoose.model('Users', userSchema);

module.exports = User;