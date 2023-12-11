const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const answerSchema = new Schema({

    text : {
        type : String,
        required : true
    },

    ans_by : {
        type : Schema.Types.ObjectId, ref: 'User',
        required : true
    },

    ans_date_time : {
        type : Date,
        required : true
    },

    votes : {
        type : Number,
        required : true,
        default: 0
    },

    comments : [{
        type : Schema.Types.ObjectId, ref: 'Comment'
    }],
    upvoted_by: [{
        type: Schema.Types.ObjectId, ref: 'User'
    }],

    downvoted_by: [{
        type: Schema.Types.ObjectId, ref: 'User'
    }]
}, {collection: 'answers'});

const Answer = mongoose.model('Answer', answerSchema);

module.exports = Answer;