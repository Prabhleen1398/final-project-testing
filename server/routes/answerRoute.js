const express = require('express');

const { getAllAnswers,
        getAnswer,
        createAnswer,
        voteAnswer,
        addCommentAnswer,
        upvoteCommentAnswer,
        updateAnswer,
        deleteAnswer } = require('../controllers/answersController');

const router = express.Router();

//GET all answers
router.get('/', getAllAnswers);

//GET an answer by its id
router.get('/:id', getAnswer);

//POST a new answer
router.post('/', createAnswer);


//Update vote for answer
router.put('/vote/:action/:id', voteAnswer);

//POST a new comment
router.post('/addcomment', addCommentAnswer);

//PUT a upvote a new comment
router.put('/comment/vote/:id', upvoteCommentAnswer);

router.put('/:id', updateAnswer);

router.delete('/:id', deleteAnswer);


module.exports = router;