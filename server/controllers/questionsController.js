const Question = require('../models/questions');
const Tags = require('../models/tags');
const Comments = require('../models/comments');
const Users = require('../models/users');

const mongoose = require('mongoose');


//GET all questions
const getAllQuestions = async (req, res) => {
    try {
        const allQuestions = await Question.find({})
            .sort({ ask_date_time: -1 })
            .populate({
                path: 'asked_by',
                model: 'Users',
                select: 'username'
            })
            // .populate('asked_by', 'username')
            .populate('tags');
        
        res.status(200).json(allQuestions);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching questions' });
    }
}


// GET a single question
const getQuestion = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid question ID' });
    }

    try {
        const question = await Question.findById(id)
        .populate({
            path: 'answers',
            populate: {
              path: 'ans_by',
              model: 'Users',
              select: 'username',
            },
          })
          .populate({
            path: 'answers',
            populate: {
              path: 'comments',
              model: Comments,
              select: 'text votes posted_by',
              populate: {
                path: 'posted_by',
                model: 'Users',
                select: 'username',
              },
            },
            options: { sort: { ans_date_time: -1 } }
          })
          
        .populate({
            path: 'asked_by',
            model: 'Users',
            select: 'username'
        })
        .populate({
            path: 'comments',
            model: Comments,
            select: 'text votes posted_by',
            populate: {
                path: 'posted_by',
                model: 'Users',
                select: 'username'
            }
        })
        .populate('tags');
        
        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }   
        res.status(200).json(question);
    } catch (error) {
        res.status(500).json({ error: error.message});
    }
}


// POST a new Question
const createQuestion = async (req, res) => {
    const { title, text, summary, tags } = req.body;

    const asked_by = req.session["currentuser"].id;

    try {
        const checkedTags = await Promise.all(tags.map(async (enteredTag) => {
          const existingTag = await Tags.findOne({ name: enteredTag });
      
          const userReputation = await Users.find({ _id: asked_by });
      
          if (existingTag) {
            return existingTag;
          } else if (userReputation < 50) {
            throw new Error("User does not have sufficient reputation to add new tags.");
          } else {
            const newTag = new Tags({
              name: enteredTag,
              created_by: asked_by,
            });
            await newTag.save();
            return newTag;
          }
        }));
      
        const newQuestion = new Question({
          title,
          text,
          summary,
          tags: checkedTags,
          answers: [],
          asked_by,
          ask_date_time: new Date(),
          views: 0,
          votes: 0,
          comments: [],
          upvoted_by: [],
          downvoted_by: [],
        });
      
        await newQuestion.save();
      
        const updatedQuestions = await Question.find({}).populate('tags').populate('answers');
        res.status(201).json(updatedQuestions);
      
      } catch (error) {
        // Handle the error and send the respective error response
        res.status(500).json({ error: error.message }); // Adjust the status code as needed
      }
      
};

const voteQuestion = async (req, res) => {
    const questionId = req.params.id;
    const action = req.params.action;
    const incrementValue = (action === 'upvote') ? 1 : ((action === 'downvote') ? -1 : 0); // +1 for upvote, -1 for downvote
    const reputationChange = (action === 'upvote') ? 5 : ((action === 'downvote') ? -10 : 0); // Reputation change value

    const curruser = req.session["currentuser"].id;
   
    try {
        const question = await Question.findById(questionId);

        if (action === 'upvote') {
            if (question.upvoted_by.includes(curruser)) {
            return res.status(400).json({ error: 'User has already upvoted on this question' });
            } else if (question.downvoted_by.includes(curruser)) {
            // If user has downvoted, remove from downvoted_by and add to upvoted_by
            question.downvoted_by.pull(curruser);
            question.upvoted_by.push(curruser);
            } else {
            // If user has not voted, add to upvoted_by
            question.upvoted_by.push(curruser);
            }
        } else if (action === 'downvote') {
            if (question.downvoted_by.includes(curruser)) {
            return res.status(400).json({ error: 'User has already downvoted on this question' });
            } else if (question.upvoted_by.includes(curruser)) {
            // If user has upvoted, remove from upvoted_by and add to downvoted_by
            question.upvoted_by.pull(curruser);
            question.downvoted_by.push(curruser);
            } else {
            // If user has not voted, add to downvoted_by
            question.downvoted_by.push(curruser);
            }
        }
        // Update the question votes and user reputation
        const updatedQuestion = await Question.findByIdAndUpdate(
            questionId,
            { $inc: { votes: incrementValue },
            $set: { last_activity: new Date() }, upvoted_by: question.upvoted_by, downvoted_by: question.downvoted_by },
            { new: true }
        );
    
        const userId = updatedQuestion.asked_by; // Adjust this based on your schema
        await Users.findByIdAndUpdate(userId, { $inc: { reputation: reputationChange } });
    
        res.json(updatedQuestion);
    }catch (error) {
      console.error('Error voting question:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

  const addComment = async (req, res) => {
    const {questionId, text }= req.body;
    const curruser = req.session["currentuser"].id;
    try {
        const newComment = new Comments({
          posted_by: curruser,
          text: text,
          upvoted_by: []
        });

        const savedComment = await newComment.save();

        const updatedQuestion = await Question.findByIdAndUpdate(
            questionId,
            { $push: { comments: savedComment._id },
            $set: { last_activity: new Date() }}, // Assuming your Question model has a 'comments' field
            { new: true }
          ).populate('comments');

          res.json(updatedQuestion)
        }catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
  }

  const upvoteComment = async (req, res) => { 
    const commentId = req.params.id;
    const currentUserId = req.session["currentuser"].id;
    try {
        const comment = await Comments.findById(commentId);
        if (comment.upvoted_by && comment.upvoted_by.includes(currentUserId)) {
          return res.status(400).json({ error: 'User has already upvoted this comment' });
        }

        const updateObj = {
            $inc: { votes: 1 },
          };
      
          if (comment.upvoted_by && comment.upvoted_by.length === 0) {
            // If upvoted_by is empty or null, create a new array with the current user
            updateObj.$set = { upvoted_by: [currentUserId] };
          } else {
            // If upvoted_by has values, push the current user to the array
            updateObj.$push = { upvoted_by: currentUserId };
          }
      
          await Comments.findByIdAndUpdate(
            commentId,
            updateObj,
            { new: true }
          );      

        const question = await Question.findOneAndUpdate(
            { 'comments': { $in: [commentId] } },
             {$set : {last_activity : new Date()}}
            ).populate('comments');
        res.json(question);
    } catch(error) {
        console.error('Error upvoting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
  }

  const acceptAns = async (req, res) => {
    try{
        // const foundAnswer = await Answer.findById(answerID);
        const {questionID, answerId} = req.body;
        const updatedQuestion = await Question.findByIdAndUpdate(
            questionID,
            {
              accepted_ans: answerId,
              $set: { last_activity: new Date() },
            },
            { new: true }
        ).populate({
            path: 'answers',
            populate: {
              path: 'ans_by',
              model: 'Users',
              select: 'username',
            },
            options: { sort: { ans_date_time: -1 } }
          })
          .populate({
            path: 'answers',
            populate: {
              path: 'comments',
              model: Comments,
              select: 'text votes posted_by',
              populate: {
                path: 'posted_by',
                model: 'Users',
                select: 'username',
              },
            },
          })
          
        .populate({
            path: 'asked_by',
            model: 'Users',
            select: 'username'
        })
        .populate({
            path: 'comments',
            model: Comments,
            select: 'text votes posted_by',
            populate: {
                path: 'posted_by',
                model: 'Users',
                select: 'username'
            }
        })
        .populate('tags');

        res.json(updatedQuestion);
  } catch (error) {
    console.error('Error accepting answer:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  }
  
const updateQuestion = async (req, res) => {
    const { id } = req.params;
    const { title, text, summary } = req.body;
    const { last_activity } = new Date();
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Invalid question ID" });
    }
  
    try {
      const updatedQuestion = await Question.findByIdAndUpdate(
        id,
        { title, text, summary, last_activity },
        { new: true }
      );
  
      if (!updatedQuestion) {
        return res.status(404).json({ error: "Question not found" });
      }
  
      res.status(200).json(updatedQuestion);
    } catch (error) {
      res.status(500).json({ error: "An error occurred while updating the question" });
    }
  };

  const deleteQuestion = async (req, res) => {
    const { id } = req.params;
  
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(404).json({ error: "Invalid question ID" });
    }
  
    try {
      const deletedQuestion = await Question.findByIdAndDelete(id);
  
      if (!deletedQuestion) {
        return res.status(404).json({ error: "Question not found" });
      }
  
      res.status(204).json({ message: "Question deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "An error occurred while deleting the question" });
    }
  };
  

module.exports = {
    getAllQuestions,
    getQuestion,
    createQuestion,
    updateQuestion,
    deleteQuestion,
    voteQuestion,
    addComment,
    upvoteComment,
    acceptAns
}