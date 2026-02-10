const aiService = require('../services/aiService');
const AppError = require('../utils/appError');
const sendResponse = require('../utils/response');

exports.getSummary = async (req, res, next) => {
    try {
        const { text } = req.body;
        if (!text) return next(new AppError('Please provide text to summarize.', 400));

        const summary = await aiService.generateSummary(text);
        sendResponse(res, 200, summary, 'Summary generated successfully');
    } catch (error) {
        next(error);
    }
};

exports.getFlashcards = async (req, res, next) => {
    try {
        const { text } = req.body;
        if (!text) return next(new AppError('Please provide text to generate flashcards.', 400));

        const flashcards = await aiService.generateFlashcards(text);
        sendResponse(res, 200, flashcards, 'Flashcards generated successfully');
    } catch (error) {
        next(error);
    }
};

exports.getPractice = async (req, res, next) => {
    try {
        const { text, type, numQuestions, numMcq } = req.body;
        if (!text) return next(new AppError('Please provide text to generate practice.', 400));

        const practice = await aiService.generatePractice(text, type, numQuestions, numMcq);
        sendResponse(res, 200, practice, 'Practice generated successfully');
    } catch (error) {
        next(error);
    }
};
