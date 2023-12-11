const express = require('express');

const { checkUniqueUsername,
    registerUser,
    loginUser, 
    sessionDetails, 
    logoutUser,
    createGuestSession } = require('../controllers/sessionController');

const router = express.Router();

//GET all answers
router.post('/check_unique', checkUniqueUsername);

//GET an answer by its id
router.post('/register', registerUser);

//POST a new answer
router.post('/login', loginUser);

//GET session details on successful login
router.get('/getsessiondetails', sessionDetails);

//post log a user out
router.post('/logout', logoutUser);

//POST create guest session
router.post('/createguestsession', createGuestSession);

module.exports = router;