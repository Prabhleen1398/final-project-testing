const Answer = require('../models/answers');
const Question = require('../models/questions');
const Comments = require('../models/comments');
const Users = require('../models/users');

const mongoose = require('mongoose');

//GET all answers
const getAllAnswers = async (req, res) => {
    try {
        const allAnswers = await Answer.find({})
            .sort({ ans_date_time: -1 })
            .populate({
                path: 'ans_by',
                model: 'Users',
                select: 'username'
            })

        res.status(200).json(allAnswers);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching answers' });
    }
}


// GET a single answer
const getAnswer = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid answer ID' });
    }

    try {
        const answer = await Answer.findById(id).populate({
            path: 'ans_by',
            model: 'Users',
            select: 'username'
        });
        
        if (!answer) {
            return res.status(404).json({ error: 'Answer not found' });
        }

        res.status(200).json(answer);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while fetching the answer' });
    }
}


// POST a new Answer
const createAnswer = async (req, res) => {
    const { text, qid } = req.body;

    const ans_by = req.session["currentuser"].id;

    try {

        const question = await Question.findById(qid);

        if (!question) {
            return res.status(404).json({ error: 'Question not found' });
        }
        const newAnswer = new Answer({
            text,
            ans_by,
            ans_date_time: new Date(),
            votes:0,
            comments: [],
            upvoted_by:[],
            downvoted_by:[]         
        });

        const savedAnswer = await newAnswer.save();

        question.answers.push(savedAnswer);

        question.last_activity = new Date();

        await question.save();

        const updatedQuestions = await Question.find({})
        .sort({ ask_date_time: -1 })
        .populate('tags') 
        .populate('answers');;

        res.status(201).json(updatedQuestions);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while creating answer' });
    }
};
const voteAnswer = async (req, res) => {
        const answerId = req.params.id;
        const action = req.params.action;
        const incrementValue = (action === 'upvote') ? 1 : ((action === 'downvote') ? -1 : 0); // +1 for upvote, -1 for downvote
        const reputationChange = (action === 'upvote') ? 5 : ((action === 'downvote') ? -10 : 0); // Reputation change value
      
        const curruser = req.session["currentuser"].id;
      
        try {
          const answer = await Answer.findById(answerId);
      
          if (action === 'upvote') {
            if (answer.upvoted_by.includes(curruser)) {
              return res.status(400).json({ error: 'User has already upvoted on this answer' });
            } else if (answer.downvoted_by.includes(curruser)) {
              // If user has downvoted, remove from downvoted_by and add to upvoted_by
              answer.downvoted_by.pull(curruser);
              answer.upvoted_by.push(curruser);
            } else {
              // If user has not voted, add to upvoted_by
              answer.upvoted_by.push(curruser);
            }
          } else if (action === 'downvote') {
            if (answer.downvoted_by.includes(curruser)) {
              return res.status(400).json({ error: 'User has already downvoted on this answer' });
            } else if (answer.upvoted_by.includes(curruser)) {
              // If user has upvoted, remove from upvoted_by and add to downvoted_by
              answer.upvoted_by.pull(curruser);
              answer.downvoted_by.push(curruser);
            } else {
              // If user has not voted, add to downvoted_by
              answer.downvoted_by.push(curruser);
            }
          }
      
          // Update the answer votes and user reputation
          const updatedAnswer = await Answer.findByIdAndUpdate(
            answerId,
            { $inc: { votes: incrementValue },
              $set: { upvoted_by: answer.upvoted_by, downvoted_by: answer.downvoted_by } },
            { new: true }
          );
      
          const userId = updatedAnswer.ans_by; // Adjust this based on your schema
          await Users.findByIdAndUpdate(userId, { $inc: { reputation: reputationChange } });

          const question = await Question.findOneAndUpdate(
            { 'answers': { $in: [answerId] } },
             {$set : {last_activity : new Date()}}
            ).populate({
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
        res.json(question);
        //   res.json(updatedAnswer);
        } catch (error) {
          console.error('Error voting answer:', error);
          res.status(500).json({ error: 'Internal Server Error' });
        }
      };

const addCommentAnswer = async (req, res) => {
    const {answerId, text }= req.body;
    const curruser = req.session["currentuser"].id;
    try {
        const newComment = new Comments({
            posted_by: curruser,
            text: text,
            votes: 0,
            upvoted_by: []
          });
      
        const savedComment = await newComment.save();

        const updatedAnswer = await Answer.findByIdAndUpdate(
            answerId,
            { $push: { comments: savedComment._id } },
            { new: true }
          );
      
          // Now, update the corresponding Question
          const question = await Question.findOneAndUpdate(
            { 'answers': { $in: [answerId] } },
            { $set: { last_activity: new Date() } },
            { new: true }
        ).populate({
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
        .populate('tags');;
        res.json(question);
        //   res.json(question);
        }catch (error) {
            console.error('Error adding comment:', error);
            res.status(500).json({ error: 'Internal Server Error' });
          }
}

const upvoteCommentAnswer = async (req, res) => {
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

       const ans= await Answer.findOne(
            { 'comments': { $in: [commentId] } },
        )
        const question = await Question.findOneAndUpdate(
            { 'answers': { $in: [ans._id] } },
             {$set : {last_activity : new Date()}}
            ).populate({
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
        res.json(question);
    } catch(error) {
        console.error('Error upvoting comment:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
}

// PUT /answers/:id
const updateAnswer = async (req, res) => {
    const { id } = req.params;
    const { text } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid answer ID' });
    }

    try {
          // Find the question containing the answer with the specified ID
        const question = await Question.findOne({ answers: mongoose.Types.ObjectId(id) });

        if (!question) {
            return res.status(404).json({ error: "Answer not found" });
        }

        const updatedAnswer = await Answer.findByIdAndUpdate(id, { text }, { new: true });
        
        if (!updatedAnswer) {
            return res.status(404).json({ error: 'Answer not found' });
        }
        await Question.findByIdAndUpdate(question._id, { last_activity: new Date() });

        res.status(200).json(updatedAnswer);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while updating the tag' });
    }
};

// DELETE /answers/:id
const deleteAnswer = async (req, res) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(404).json({ error: 'Invalid tag ID' });
    }

    try {
        const deletedAnswer = await Answer.findByIdAndDelete(id);
        
        if (!deletedAnswer) {
            return res.status(404).json({ error: 'Tag not found' });
        }

        res.status(204).json({ message: 'Answer deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred while deleting the tag' });
    }
};



module.exports = {
    getAllAnswers,
    getAnswer,
    createAnswer,
    voteAnswer,
    addCommentAnswer,
    upvoteCommentAnswer,
    updateAnswer,
    deleteAnswer
}
