const express = require('express');

const { getAllTags,
        getTag,
        createTag,
        getQuestionsForTag,
        updateTag,
        deleteTag } = require('../controllers/tagsController');

const router = express.Router();

//GET all tags
router.get('/', getAllTags);

//GET a tag by its id
router.get('/:id', getTag);

//POST a tag
router.post('/', createTag);

//GET questions for a tag
router.get('/getQuestionsForTag/:id', getQuestionsForTag);

router.put('/:id', updateTag);

router.delete('/:id', deleteTag);

module.exports = router;