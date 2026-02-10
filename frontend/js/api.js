import { showToast } from './utils.js';

const API_URL = '/api/v1'; // Relative path for deployment compatibility

export const generateSummary = async (text) => {
    try {
        const res = await fetch(`${API_URL}/summary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!res.ok) throw new Error('Failed to generate summary');
        const data = await res.json();
        return data.data; // Standardized API response structure
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    }
};

export const generateFlashcards = async (text) => {
    try {
        const res = await fetch(`${API_URL}/flashcards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });

        if (!res.ok) throw new Error('Failed to generate flashcards');
        const data = await res.json();
        return data.data;
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    }
};

export const generateQuiz = async (text, type, numQuestions, numMcq) => {
    try {
        const res = await fetch(`${API_URL}/practice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text, type, numQuestions: parseInt(numQuestions), numMcq: parseInt(numMcq) })
        });

        if (!res.ok) throw new Error('Failed to generate quiz');
        const data = await res.json();
        return data.data;
    } catch (error) {
        showToast(error.message, 'error');
        throw error;
    }
};
