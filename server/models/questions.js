const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const questionSchema = new Schema({
    title : {
        type : String,
        required : true
    },

    text : {
        type : String,
        required : true
    },

    summary: {
        type: String,
        required: true
    },

    tags : [{
        type : Schema.Types.ObjectId, ref: 'Tag'
    }],

    answers : [{
        type : Schema.Types.ObjectId, ref: 'Answer'
    }],

    asked_by : {
        type : Schema.Types.ObjectId, ref: 'User',
        required : true
    },

    ask_date_time : {
        type : Date,
        required : true
    },

    views : {
        type : Number,
        required : true,
        default : 0
    },

    votes : {
        type: Number,
        required: true,
        default: 0
    }, 

    comments: [{
        type: Schema.Types.ObjectId, ref: 'Comment'
    }],

    accepted_ans: {
        type: Schema.Types.ObjectId, ref: 'Answer'
    },

    last_activity: {
        type: Date,
        required : true,
        default:  function () {return this.ask_date_time;}
    },

    upvoted_by: [{
        type: Schema.Types.ObjectId, ref: 'User'
    }],

    downvoted_by: [{
        type: Schema.Types.ObjectId, ref: 'User'
    }]
}, {collection: 'questions'});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;