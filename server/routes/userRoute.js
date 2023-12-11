const express = require('express');
const router = express.Router();

const { getUserInfo,
        getUserQuestions,
        getUserTags,
        getUserAnswers } = require('../controllers/userController');

router.get('/userInfo/:username', getUserInfo);
router.get('/userQuestions', getUserQuestions);
router.get('/userTags', getUserTags);
router.get('/userAnswers', getUserAnswers);
//router.put('/repostQuestion/:questionId', repostQuestion);
// Add routes for deleting and editing questions, tags, and answers

module.exports = router;
