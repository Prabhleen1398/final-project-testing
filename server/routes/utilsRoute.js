const express = require('express');

const { sortQuestions,
        incrementViews,
         } = require('../controllers/utilsController');

const router = express.Router();

//GET sorted questions - newest/acive/unanswered
router.get('/', sortQuestions);

//PUT - increment the view count of a question
router.put('/:id', incrementViews);

module.exports = router;