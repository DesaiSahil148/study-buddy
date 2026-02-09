/**
 * AI Study Buddy - Application Logic
 */

const API_URL = '';

// State
const state = {
    currentView: 'home', // 'home', 'summary', 'flashcards', 'practice'
    user: null
};

// DOM Elements
const elements = {};

document.addEventListener('DOMContentLoaded', () => {
    cacheElements();
    initApp();
});

function cacheElements() {
    // Nav
    elements.navLogo = document.getElementById('nav-logo');
    elements.navSumm = document.getElementById('nav-summ');
    elements.navFlash = document.getElementById('nav-flash');
    elements.navPrac = document.getElementById('nav-prac');
    elements.navCta = document.getElementById('nav-cta');
    elements.heroCta = document.getElementById('hero-cta');

    // Sections
    elements.homeSection = document.getElementById('home-section');
    elements.summarySection = document.getElementById('summary-section');
    elements.flashcardsSection = document.getElementById('flashcards-section');
    elements.practiceSection = document.getElementById('practice-section');

    // Auth
    elements.authView = document.getElementById('auth-view');
    elements.closeAuth = document.getElementById('close-auth');
    elements.loginForm = document.getElementById('login-form');

    // Tools
    elements.summaryInput = document.getElementById('summary-input');
    elements.btnGenerateSummary = document.getElementById('btn-generate-summary');
    elements.summaryOutputPanel = document.getElementById('summary-output-panel');
    elements.summaryWordCount = document.getElementById('summary-word-count');

    elements.flashcardInput = document.getElementById('flashcard-input');
    elements.btnGenerateFlashcards = document.getElementById('btn-generate-flashcards');
    elements.flashcardsOutputPanel = document.getElementById('flashcards-output-panel');

    elements.quizInput = document.getElementById('quiz-input');
    elements.btnOpenQuizModal = document.getElementById('btn-open-quiz-modal');
    elements.quizOutputPanel = document.getElementById('quiz-output-panel');

    // Quiz Modal
    elements.quizModal = document.getElementById('quiz-modal');
    elements.optQuestions = document.getElementById('opt-questions');
    elements.optMcq = document.getElementById('opt-mcq');
    elements.optBoth = document.getElementById('opt-both');
    elements.bothOptions = document.getElementById('both-options');
    elements.btnCancelQuiz = document.getElementById('btn-cancel-quiz');
    elements.btnStartQuiz = document.getElementById('btn-start-quiz');
    elements.numQuestions = document.getElementById('num-questions');
    elements.numMcq = document.getElementById('num-mcq');
}

function initApp() {
    setupEventListeners();
    // Start at home
    navigateTo('home');
}

// --- Navigation ---
function navigateTo(view) {
    state.currentView = view;

    // Hide all
    const allSections = [elements.homeSection, elements.summarySection, elements.flashcardsSection, elements.practiceSection];
    allSections.forEach(el => el.classList.add('hidden'));

    // Show Target
    if (view === 'home') elements.homeSection.classList.remove('hidden');
    if (view === 'summary') elements.summarySection.classList.remove('hidden');
    if (view === 'flashcards') elements.flashcardsSection.classList.remove('hidden');
    if (view === 'practice') elements.practiceSection.classList.remove('hidden');

    // Scroll to top
    window.scrollTo(0, 0);
}

// --- Event Listeners ---
function setupEventListeners() {
    // Nav
    elements.navLogo.addEventListener('click', () => navigateTo('home'));
    if (elements.navSumm) elements.navSumm.addEventListener('click', () => navigateTo('summary'));
    if (elements.navFlash) elements.navFlash.addEventListener('click', () => navigateTo('flashcards'));
    if (elements.navPrac) elements.navPrac.addEventListener('click', () => navigateTo('practice'));

    // CTAs (Auth)
    elements.navCta.addEventListener('click', openAuth);
    elements.heroCta.addEventListener('click', openAuth);
    elements.closeAuth.addEventListener('click', closeAuth);
    elements.loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        closeAuth();
        elements.navCta.innerText = "Dashboard"; // Mock login state
        alert("Welcome back!");
    });

    // Tool Actions
    elements.summaryInput.addEventListener('input', () => {
        const words = elements.summaryInput.value.trim().split(/\s+/).length;
        elements.summaryWordCount.innerText = elements.summaryInput.value.trim() === '' ? '0 words' : `${words} words`;
    });

    elements.btnGenerateSummary.addEventListener('click', generateSummary);
    elements.btnGenerateFlashcards.addEventListener('click', generateFlashcards);

    // Quiz
    elements.btnOpenQuizModal.addEventListener('click', () => elements.quizModal.classList.remove('hidden'));
    elements.btnCancelQuiz.addEventListener('click', () => elements.quizModal.classList.add('hidden'));

    // Quiz Types
    elements.optQuestions.addEventListener('click', () => toggleQuizType('questions'));
    elements.optMcq.addEventListener('click', () => toggleQuizType('mcq'));
    elements.optBoth.addEventListener('click', () => toggleQuizType('both'));

    elements.btnStartQuiz.addEventListener('click', generateQuiz);
}

// --- Auth ---
function openAuth() { elements.authView.classList.remove('hidden'); }
function closeAuth() { elements.authView.classList.add('hidden'); }

// --- Generator Logic (Similar to before but polished) ---
let quizType = 'questions';

function toggleQuizType(type) {
    quizType = type;
    [elements.optQuestions, elements.optMcq, elements.optBoth].forEach(b => {
        b.classList.remove('btn-primary', 'glow-blue');
        b.classList.add('btn-outline');
    });

    let active;
    if (type === 'questions') active = elements.optQuestions;
    if (type === 'mcq') active = elements.optMcq;
    if (type === 'both') active = elements.optBoth;

    active.classList.remove('btn-outline');
    active.classList.add('btn-primary', 'glow-blue');

    if (type === 'both') {
        elements.bothOptions.classList.remove('hidden');
        elements.bothOptions.classList.add('flex');
    } else {
        elements.bothOptions.classList.add('hidden');
        elements.bothOptions.classList.remove('flex');
    }
}

// --- API Calls ---

async function generateSummary() {
    const text = elements.summaryInput.value;
    if (!text) return alert("Please enter text.");

    const btn = elements.btnGenerateSummary;
    btn.innerText = "Generating...";
    btn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/summary`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const data = await res.json();

        // Render
        const html = `
            <h3 class="text-cyan-400 mb-4">${data.title}</h3>
            <p class="mb-4 text-white">${data.core_idea}</p>
            <ul class="list-disc pl-5 text-muted mb-4 space-y-2">
                ${data.key_points.map(p => `<li>${p}</li>`).join('')}
            </ul>
        `;
        elements.summaryOutputPanel.innerHTML = html;
        elements.summaryOutputPanel.classList.remove('hidden');

    } catch (e) {
        alert("Error generating summary");
    } finally {
        btn.innerText = "Generate Summary";
        btn.disabled = false;
    }
}

async function generateFlashcards() {
    const text = elements.flashcardInput.value;
    if (!text) return alert("Please enter notes.");

    const btn = elements.btnGenerateFlashcards;
    btn.innerText = "Creating...";
    btn.disabled = true;

    try {
        const res = await fetch(`${API_URL}/flashcards`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ text })
        });
        const data = await res.json();

        elements.flashcardsOutputPanel.innerHTML = '';
        data.forEach(card => {
            const el = document.createElement('div');
            el.className = 'glass-card cursor-pointer hover:border-purple-500 transition-all';
            el.innerHTML = `
                <div class="text-center">
                    <p class="text-purple-400 font-bold mb-2">Q</p>
                    <p>${card.q}</p>
                    <p class="text-xs text-muted mt-4">Click to flip</p>
                </div>
            `;
            let flipped = false;
            el.onclick = () => {
                flipped = !flipped;
                if (flipped) {
                    el.innerHTML = `
                        <div class="text-center fade-in">
                             <p class="text-white font-bold mb-2">A</p>
                             <p class="text-white">${card.a}</p>
                        </div>
                    `;
                    el.style.borderColor = 'rgba(168, 85, 247, 0.8)';
                } else {
                    el.innerHTML = `
                        <div class="text-center fade-in">
                            <p class="text-purple-400 font-bold mb-2">Q</p>
                            <p>${card.q}</p>
                            <p class="text-xs text-muted mt-4">Click to flip</p>
                        </div>
                    `;
                    el.style.borderColor = '';
                }
            };
            elements.flashcardsOutputPanel.appendChild(el);
        });

    } catch (e) {
        alert("Error generating flashcards");
    } finally {
        btn.innerText = "Create Deck";
        btn.disabled = false;
    }
}

async function generateQuiz() {
    elements.quizModal.classList.add('hidden');
    const text = elements.quizInput.value;
    const btn = elements.btnOpenQuizModal; // The trigger button

    // Show loading state in output
    elements.quizOutputPanel.innerHTML = '<div class="text-center text-muted">Generating Quiz...</div>';
    elements.quizOutputPanel.classList.remove('hidden');

    try {
        const res = await fetch(`${API_URL}/practice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                type: quizType,
                numQuestions: elements.numQuestions.value,
                numMcq: elements.numMcq.value
            })
        });
        const data = await res.json();

        let html = '<div class="space-y-6">';

        if (data.questions) {
            html += '<h3 class="text-blue-400">Questions</h3>';
            data.questions.forEach((q, i) => {
                html += `
                    <div class="glass-card text-left p-4">
                        <p class="font-bold mb-2">${i + 1}. ${q}</p>
                        <textarea class="w-full bg-black/30 rounded p-2 text-sm" placeholder="Answer..."></textarea>
                    </div>
                `;
            });
        }

        if (data.mcq) {
            html += '<h3 class="text-blue-400 mt-8">Multiple Choice</h3>';
            data.mcq.forEach((m, i) => {
                html += `
                    <div class="glass-card text-left p-4">
                        <p class="font-bold mb-2">${m.question}</p>
                        <div class="space-y-2">
                            ${m.options.map(opt => `<label class="block p-2 hover:bg-white/5 rounded cursor-pointer"><input type="radio" name="m${i}"> ${opt}</label>`).join('')}
                        </div>
                    </div>
                `;
            });
        }
        html += '</div>';

        elements.quizOutputPanel.innerHTML = html;

    } catch (e) {
        elements.quizOutputPanel.innerHTML = "Error generating quiz.";
    }
}

// Global Nav export for inline HTML onclicks if any (using EventListeners preferred now)
window.navigateTo = navigateTo;
