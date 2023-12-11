const express = require('express');

const router = express.Router();

const {searchResults} = require('../controllers/searchController');

//GET search results
router.get('/', searchResults);

module.exports = router;