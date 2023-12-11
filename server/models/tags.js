const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const tagSchema = new Schema({

    name : {
        type : String,
        required : true
    },
    created_by : {
        type : Schema.Types.ObjectId, ref: 'User',
        required : true
    }

}, {collection: 'tags'});

const Tag = mongoose.model('Tag', tagSchema);

module.exports = Tag;