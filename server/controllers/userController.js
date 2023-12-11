// controllers/UserController.js

const User = require('../models/users');
const Question = require('../models/questions');
const Tag = require('../models/tags');
const Answer = require('../models/answers');


const getUserInfo = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const userSince = calculateDaysSince(user.register_date);
    res.status(200).json({
      userSince,
      reputation: user.reputation,
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getUserQuestions = async (req, res) => {
  try {
    const userId = req.session["currentuser"].id;
    const questions = await Question.find({ asked_by: userId });
    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};


const getUserAnswers = async (req, res) => {
  try {
    const userId = req.session["currentuser"].id;
    const answers = await Answer.find({ ans_by: userId});
    res.status(200).json(answers);
  } catch (error) {
    res.status(500).json({ error: error });
  }
  // 'Internal Server Error'
};

const getUserTags = async (req, res) => {
  try {
    const userId = req.session["currentuser"].id;
    const tags = await Tag.find({ created_by: userId });
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

// Calculate days since user joined
const calculateDaysSince = (joinDate) => {
  const currentDate = new Date();
  const daysSince = Math.floor((currentDate - joinDate) / (24 * 60 * 60 * 1000));
  return daysSince;
};

module.exports = { 
    getUserInfo,
    calculateDaysSince,
    getUserQuestions,
    getUserAnswers,
    getUserTags
}
  
// const repostQuestion = async (req, res) => {
//     try {
//       const userId = req.user.id; // Assuming you have user information in req.user
//       const { questionId } = req.params;

//       // Fetch the question
//       const question = await Question.findById(questionId);
//       if (!question) {
//         return res.status(404).json({ message: 'Question not found' });
//       }

//       if (String(question.asked_by) !== userId) {
//         return res.status(403).json({ message: 'Permission denied' });
//       }

//       // Repost the question
//       const newQuestion = new Question({
//         title: question.title,
//         text: question.text,
//         tags: question.tags,
//         asked_by: userId,
//         ask_date_time: new Date(),
//         views: 0,
//       });

//       await newQuestion.save();

//       res.status(201).json(newQuestion);
//     } catch (error) {
//       console.error('Error reposting question:', error);
//       res.status(500).send('Internal Server Error');
//     }
//   }


