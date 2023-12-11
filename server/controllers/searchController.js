const mongoose = require('mongoose');
const Question = require('../models/questions');

// search through the db and return search Results
const searchResults = async(req, res) => {
    const { searchInput } = req.query;
    const searchTermLowerCase = searchInput.toLowerCase();
    try {
    const questions = await Question.find()
        .populate('tags')
        .exec();
    
    const tagMatches = searchTermLowerCase.match(/\[([^\]]+)\]/g);
    const tagNames = tagMatches ? tagMatches.map(match => match.slice(1, -1).toLowerCase()) : [];

    const filteredQuestions = questions.filter(que => {
        const titleWords = que.title.toLowerCase().split(' ');
        const textWords = que.text.toLowerCase().split(' ');

        // Search tags
        const questionTags = que.tags.map(tag => tag.name.toLowerCase());

        const tagMatch = tagNames.some(tagName => questionTags.includes(tagName));

        // Check if any word in the title or text matches the search term
        const allSearchWords = searchTermLowerCase.split(' ');
        const titleMatch = titleWords.some(titleWord => allSearchWords.includes(titleWord));
        const textMatch = textWords.some(textWord => allSearchWords.includes(textWord));

        return titleMatch || textMatch || tagMatch;
    });

    res.status(200).json(filteredQuestions);
} catch (error) {
    console.error('Error fetching and filtering questions:', error);
    res.status(500).json({ error: 'An error occurred while fetching and filtering questions' });
}
};

module.exports = {searchResults}