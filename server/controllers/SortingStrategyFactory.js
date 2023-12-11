const Question = require('../models/questions');

class NewestSortStrategy {
    async sort(questions) {
      return Question.find({ _id: { $in: questions } })
        .sort({ ask_date_time: -1 })
        .populate('tags')
        .populate({
          path: 'asked_by',
          model: 'Users',
          select: 'username'
        })
        .populate('answers');
    }
  }
  
//   class ActiveSortStrategy {
//     async sort(questions) {
//       const allQuestions = await Question.find({ _id: { $in: questions } })
//         .populate('tags')
//         .populate({
//           path: 'asked_by',
//           model: 'Users',
//           select: 'username'
//         })
//         .populate('answers');
  
//       const sortedQuestions = allQuestions.map((question) => {
//         const answerDates = question.answers.map((answer) => answer.ans_date_time);
//         const latestAnswerDate = Math.max(...answerDates, new Date(0));
//         return { ...question._doc, latestAnswerDate };
//       }).sort((q1, q2) => q2.latestAnswerDate - q1.latestAnswerDate);
  
//       return sortedQuestions;
//     }
//   }

class ActiveSortStrategy {
    async sort(questions) {
      const allQuestions = await Question.find({ _id: { $in: questions } })
        .populate('tags')
        .populate({
          path: 'asked_by',
          model: 'Users',
          select: 'username'
        })
        .populate('answers');
  
      const sortedQuestions = allQuestions.sort((q1, q2) => q2.last_activity - q1.last_activity);
  
      return sortedQuestions;
    }
  }
  
  
  class UnansweredSortStrategy {
    async sort(questions) {
      return Question.find({ _id: { $in: questions }, answers: { $size: 0 } })
        .populate('tags')
        .populate({
          path: 'asked_by',
          model: 'Users',
          select: 'username'
        })
        .populate('answers');
    }
  }
  
  class SortingStrategyFactory {
    createStrategy(sort) {
      switch (sort) {
        case 'newest':
          return new NewestSortStrategy();
        case 'active':
          return new ActiveSortStrategy();
        case 'unanswered':
          return new UnansweredSortStrategy();
        default:
          throw new Error('Invalid sorting criteria');
      }
    }
  }
  
  module.exports = SortingStrategyFactory;