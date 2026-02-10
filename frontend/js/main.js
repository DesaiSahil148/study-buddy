import * as API from './api.js';
import * as UI from './ui.js';
import { showToast } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
    setupEventListeners();
    showToast('Welcome to Study Buddy!', 'info');
});

function setupEventListeners() {

    // --- Navigation ---
    document.getElementById('nav-logo').addEventListener('click', () => window.location.reload());
    // --- Navigation & Auth ---
    document.getElementById('nav-logo').addEventListener('click', () => window.location.reload());

    // Check Auth State
    checkAuthState();

    const loginBtn = document.getElementById('nav-login');
    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = 'login.html';
        });
    }

    const logoutBtn = document.getElementById('nav-logout');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            localStorage.removeItem('studyBuddyUser');
            showToast('Logged out successfully', 'info');
            setTimeout(() => checkAuthState(), 500);
        });
    }

    // --- Summary Tool ---
    const btnSummary = document.getElementById('btn-generate-summary');
    btnSummary.addEventListener('click', async () => {
        const text = document.getElementById('summary-input').value;
        if (!text.trim()) return showToast('Please enter text to summarize.', 'error');

        setLoading(btnSummary, true, 'Generating...');
        try {
            const data = await API.generateSummary(text);
            UI.renderSummary(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(btnSummary, false, 'Generate Summary');
        }
    });

    document.getElementById('close-summary-output').addEventListener('click', UI.closeSummary);


    // --- Flashcards Tool ---
    const btnFlashcards = document.getElementById('btn-generate-flashcards');
    btnFlashcards.addEventListener('click', async () => {
        const text = document.getElementById('flashcard-input').value;
        if (!text.trim()) return showToast('Please enter notes.', 'error');

        setLoading(btnFlashcards, true, 'Creating Deck...');
        try {
            const data = await API.generateFlashcards(text);
            UI.setupFlashcards(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(btnFlashcards, false, 'Create Deck');
        }
    });

    document.getElementById('close-flashcards-output').addEventListener('click', UI.closeFlashcards);
    document.getElementById('flip-card-btn').addEventListener('click', UI.flipCard);
    document.getElementById('flashcard-display').addEventListener('click', UI.flipCard); // Click card to flip too
    document.getElementById('next-card').addEventListener('click', UI.nextCard);
    document.getElementById('prev-card').addEventListener('click', UI.prevCard);

    // --- Practice Tool ---
    let quizType = 'questions';
    const btnQuiz = document.getElementById('btn-start-quiz');

    // Quiz Type Toggles
    const optQuestions = document.getElementById('opt-questions');
    const optMcq = document.getElementById('opt-mcq');
    const optBoth = document.getElementById('opt-both');

    const setQuizType = (type, btn) => {
        quizType = type;
        [optQuestions, optMcq, optBoth].forEach(b => {
            b.classList.remove('bg-blue-600', 'text-white', 'shadow');
            b.classList.add('text-muted');
        });
        btn.classList.add('bg-blue-600', 'text-white', 'shadow');
        btn.classList.remove('text-muted');
    };

    optQuestions.addEventListener('click', () => setQuizType('questions', optQuestions));
    optMcq.addEventListener('click', () => setQuizType('mcq', optMcq));
    optBoth.addEventListener('click', () => setQuizType('both', optBoth));

    btnQuiz.addEventListener('click', async () => {
        const text = document.getElementById('quiz-input').value;
        if (!text.trim()) return showToast('Please enter study material.', 'error');

        const numQ = document.getElementById('num-questions').value;
        const numMcq = document.getElementById('num-mcq').value;

        setLoading(btnQuiz, true, 'Generating Quiz...');
        try {
            const data = await API.generateQuiz(text, quizType, numQ, numMcq);
            UI.renderQuiz(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(btnQuiz, false, 'Start Practice');
        }
    });

    document.getElementById('close-quiz-output').addEventListener('click', UI.closeQuiz);
}

function setLoading(btn, isLoading, text) {
    if (isLoading) {
        btn.disabled = true;
        btn.innerHTML = `<span class="animate-spin inline-block mr-2">⟳</span> ${text}`;
        btn.classList.add('opacity-75', 'cursor-not-allowed');
    } else {
        btn.disabled = false;
        btn.innerHTML = text;
        btn.classList.remove('opacity-75', 'cursor-not-allowed');
    }
}

function checkAuthState() {
    const userStr = localStorage.getItem('studyBuddyUser');
    const loginBtn = document.getElementById('nav-login');
    const userMenu = document.getElementById('user-menu');
    const userNameSpan = document.getElementById('user-name');

    if (userStr) {
        const user = JSON.parse(userStr);
        if (loginBtn) loginBtn.classList.add('hidden');
        if (userMenu) {
            userMenu.classList.remove('hidden');
            userNameSpan.innerText = `Hi, ${user.name}`;
        }
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (userMenu) userMenu.classList.add('hidden');
    }
}
