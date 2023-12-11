const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({

    text : {
        type : String,
        required : true
    },
    votes : {
        type : Number,
        required : true,
        default: 0
    },
    posted_by : {
        type : Schema.Types.ObjectId, ref: 'User',
        required : true
    },
    upvoted_by: [{
        type: Schema.Types.ObjectId, ref: 'User'
    }]

}, {collection: 'comments'});

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;