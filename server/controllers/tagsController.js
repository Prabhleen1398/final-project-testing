const Tag = require('../models/tags');

const mongoose = require('mongoose');
const Question = require('../models/questions');

//GET all tags
const getAllTags = async (req, res) => {
    try {
        const allTags = await Tag.find({})

        res.status(200).json(allTags);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching tags' });
    }
}


// GET a single tag
const getTag = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid tag ID' });
    }

    try {
        const tag = await Tag.findById(id);
        
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        res.status(200).json(tag);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the tag' });
    }
}

// POST a new Tag
const createTag = async (req, res) => {
    const { name } = req.body;

    try {
        const newTag = new Tag({
            name         
        });

        const savedTag = await newTag.save();

        res.status(201).json(savedTag);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating tag' });
    }
};

// GET quesions for a tag
const getQuestionsForTag = async ( req, res ) => {
    const id = req.params.id;
    // res.send(id);

    if(!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid tag ID' });
    }
    try {
        const tag = await Tag.findById(id);
        
        if (!tag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        const questions = await Question.find({ tags: id })
        .sort({ ask_date_time: -1 })
        .populate('tags')
        .exec();
            

        res.status(200).json(questions);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the questions for this tag' });
    }
}

// PUT /tags/:id
const updateTag = async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid tag ID' });
    }

    try {
        const updatedTag = await Tag.findByIdAndUpdate(id, { name }, { new: true });
        
        if (!updatedTag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        res.status(200).json(updatedTag);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the tag' });
    }
};

// DELETE /tags/:id
const deleteTag = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid tag ID' });
    }

    try {
        const deletedTag = await Tag.findByIdAndDelete(id);
        
        if (!deletedTag) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        res.status(204).json({ message: 'Tag deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the tag' });
    }
};



module.exports = {
    getAllTags,
    getTag,
    createTag,
    getQuestionsForTag,
    updateTag,
    deleteTag
}
