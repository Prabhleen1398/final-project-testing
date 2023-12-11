const mongoose = require('mongoose');
const Question = require('../models/questions');

const SortingStrategyFactory = require('./SortingStrategyFactory');

const sortQuestions = async (req, res) => {
  const { sort, questions } = req.query;

  try {
    const sortingStrategyFactory = new SortingStrategyFactory();
    const sortingStrategy = sortingStrategyFactory.createStrategy(sort);
    const sortedQuestions = await sortingStrategy.sort(questions);

    res.status(200).json(sortedQuestions);
  } catch (error) {
    res.status(500).json({ error: 'An error occurred while fetching sorted questions' });
  }
};


// // GET sorted questions
// const sortQuestions = async (req, res) => {
//     const { sort, questions } = req.query;
//     try {
//         let sortedQuestions;

//         if (sort === 'newest') {
//             sortedQuestions = await Question.find({ _id: { $in: questions } })
//             .sort({ ask_date_time: -1 })
//             .populate('tags')
//             .populate({
//                 path: 'asked_by',
//                 model: 'Users',
//                 select: 'username'
//             })
//             .populate('answers');
//         } else if (sort === 'active') {
//                 try {
//                     const allQuestions = await Question.find({ _id: { $in: questions } })
//                         .populate('tags')
//                         .populate({
//                             path: 'asked_by',
//                             model: 'Users',
//                             select: 'username'
//                         })
//                         .populate('answers');
        
//                     sortedQuestions = allQuestions.map((question) => {
//                         const answerDates = question.answers.map((answer) => answer.ans_date_time);
//                         const latestAnswerDate = Math.max(...answerDates, new Date(0));
//                         return { ...question._doc, latestAnswerDate };
//                     })
//                     .sort((q1, q2) => q2.latestAnswerDate - q1.latestAnswerDate);
//                 } catch (error) {
//                     console.error(error);
//                 }
//         } else if (sort === 'unanswered') {
//             sortedQuestions = await Question.find({ _id: { $in: questions }, answers: { $size: 0 } })
//                 .populate('tags')
//                 .populate({
//                     path: 'asked_by',
//                     model: 'Users',
//                     select: 'username'
//                 })
//                 .populate('answers');
//         } else {
//             return res.status(400).json({ error: 'Invalid sorting criteria' });
//         }

//         res.status(200).json(sortedQuestions);
//     } catch (error) {
//         res.status(500).json({ error: 'An error occurred while fetching sorted questions' });
//     }
// };

// Increment views for a question
const incrementViews = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid question ID' });
    }

    try {
        const question = await Question.findByIdAndUpdate(id, { $inc: { views: 1 } }, { new: true })
        .populate('tags')
        .populate({
            path: 'asked_by',
            model: 'Users',
            select: 'username'
        })
        .populate('answers').exec();

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }

        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while incrementing views' });
    }
};

module.exports = {
    sortQuestions,
    incrementViews
}
