const express = require('express');

const { getAllQuestions,
        getQuestion,
        createQuestion,
        voteQuestion,
        addComment,
        upvoteComment,
        acceptAns,
        updateQuestion,
        deleteQuestion } = require('../controllers/questionsController');

const router = express.Router();

//GET all questions
router.get('/', getAllQuestions);

//GET a question by its id
router.get('/:id', getQuestion);

//POST a new question
router.post('/', createQuestion);

//PUT accept ans
router.put('/ansaccept', acceptAns);

//PUT to upvote a question
router.put('/vote/:action/:id', voteQuestion);

//POST a new comment
router.post('/addcomment', addComment);

//PUT a upvote a new comment
router.put('/comment/vote/:id', upvoteComment);


router.put('/:id', updateQuestion);

router.delete('/:id', deleteQuestion);

module.exports = router;