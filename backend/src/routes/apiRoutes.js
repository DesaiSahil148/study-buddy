const express = require('express');
const aiController = require('../controllers/aiController');
const router = express.Router();

router.post('/summary', aiController.getSummary);
router.post('/flashcards', aiController.getFlashcards);
router.post('/practice', aiController.getPractice);

module.exports = router;
