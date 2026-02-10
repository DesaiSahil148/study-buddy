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
    elements.navLogin = document.getElementById('nav-login');

    // Summary Tool
    elements.summaryInput = document.getElementById('summary-input');
    elements.btnGenerateSummary = document.getElementById('btn-generate-summary');
    elements.summaryOutputPanel = document.getElementById('summary-output-panel');
    elements.summaryContent = document.getElementById('summary-content');

    // Flashcard Tool
    elements.flashcardInput = document.getElementById('flashcard-input');
    elements.btnGenerateFlashcards = document.getElementById('btn-generate-flashcards');
    elements.flashcardsOutputPanel = document.getElementById('flashcards-output-panel');
    elements.flashcardInputContainer = document.getElementById('flashcard-input-container');
    elements.flashcardDisplay = document.getElementById('flashcard-display'); // The card itself
    elements.flipCardBtn = document.getElementById('flip-card-btn');
    elements.prevCard = document.getElementById('prev-card');
    elements.nextCard = document.getElementById('next-card');

    // Practice Tool
    elements.quizInput = document.getElementById('quiz-input');
    elements.btnStartQuiz = document.getElementById('btn-start-quiz');
    elements.quizInputContainer = document.getElementById('quiz-input-container');
    elements.quizOutputPanel = document.getElementById('quiz-output-panel');
    elements.quizContent = document.getElementById('quiz-content');
    elements.numQuestions = document.getElementById('num-questions');
    elements.numMcq = document.getElementById('num-mcq');
}

// No navigation needed in dashboard view


// --- Event Listeners ---
function setupEventListeners() {
    // Nav
    elements.navLogo.addEventListener('click', () => window.location.reload());

    // Auth (Mock)
    if (elements.navLogin) {
        elements.navLogin.addEventListener('click', () => {
            elements.navLogin.innerText = "Sahil";
            alert("Welcome back, Sahil!");
        });
    }

    // Tool Actions
    elements.btnGenerateSummary.addEventListener('click', generateSummary);
    elements.btnGenerateFlashcards.addEventListener('click', generateFlashcards);
    elements.btnStartQuiz.addEventListener('click', generateQuiz);

    // Flashcard Flip
    if (elements.flipCardBtn) elements.flipCardBtn.addEventListener('click', flipCard);
    if (elements.prevCard) elements.prevCard.addEventListener('click', prevCard);
    if (elements.nextCard) elements.nextCard.addEventListener('click', nextCard);

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

        // Render in overlay
        const html = `
            <h3 class="text-cyan-400 mb-2 font-bold text-lg">${data.title}</h3>
            <p class="mb-4 text-white/90">${data.core_idea}</p>
            <ul class="list-disc pl-5 text-muted space-y-1">
                ${data.key_points.map(p => `<li>${p}</li>`).join('')}
            </ul>
        `;
        elements.summaryContent.innerHTML = html;
        elements.summaryOutputPanel.classList.remove('hidden');
        elements.summaryOutputPanel.classList.add('flex');

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

        // NEW LOGIC: Setup unified viewer
        currentFlashcards = data;
        currentCardIndex = 0;

        elements.flashcardInputContainer.classList.add('hidden');
        elements.flashcardsOutputPanel.classList.remove('hidden');
        elements.flashcardsOutputPanel.classList.add('flex');

        renderCurrentCard();

    } catch (e) {
        alert("Error generating flashcards");
    } finally {
        btn.innerText = "Create Deck";
        btn.disabled = false;
    }
}

// Flashcard Navigation Logic
let currentFlashcards = [];
let currentCardIndex = 0;
let isFlipped = false;

function renderCurrentCard() {
    if (!elements.flashcardDisplay) return;

    const card = currentFlashcards[currentCardIndex];
    const total = currentFlashcards.length;

    // Reset flip state
    isFlipped = false;
    updateCardFace(card);

    // Update count
    const counter = elements.flashcardsOutputPanel.querySelector('.text-mono');
    if (counter) counter.innerText = `${currentCardIndex + 1} / ${total}`;
}

function updateCardFace(card) {
    const display = elements.flashcardDisplay;
    if (isFlipped) {
        display.innerHTML = `
            <div class="absolute top-4 right-4 text-purple-400 opacity-50"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M12 4v16"/></svg></div>
            <div class="fade-in">
                <h4 class="text-white font-bold mb-3 text-lg">Answer</h4>
                <p class="text-lg text-purple-200">${card.a}</p>
            </div>
        `;
        display.style.borderColor = 'rgba(192, 132, 252, 0.6)';
    } else {
        display.innerHTML = `
            <div class="absolute top-4 right-4 text-purple-400 opacity-50"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M12 4v16"/></svg></div>
            <div class="fade-in">
                <h4 class="text-purple-300 font-bold mb-3 text-lg">Question</h4>
                <p class="text-lg text-gray-300">${card.q}</p>
            </div>
        `;
        display.style.borderColor = '';
    }
}

function flipCard() {
    if (currentFlashcards.length === 0) return;
    isFlipped = !isFlipped;
    updateCardFace(currentFlashcards[currentCardIndex]);
}

function nextCard() {
    if (currentFlashcards.length === 0) return;
    if (currentCardIndex < currentFlashcards.length - 1) {
        currentCardIndex++;
        renderCurrentCard();
    }
}

function prevCard() {
    if (currentFlashcards.length === 0) return;
    if (currentCardIndex > 0) {
        currentCardIndex--;
        renderCurrentCard();
    }
}

async function generateQuiz() {
    const text = elements.quizInput.value;
    if (!text) return alert("Please enter study material.");

    const btn = elements.btnStartQuiz;
    btn.innerText = "Generating...";
    btn.disabled = true;

    // Show loading state
    elements.quizContent.innerHTML = '<div class="text-center text-muted p-4">Generating Quiz...</div>';
    elements.quizInputContainer.classList.add('hidden');
    elements.quizOutputPanel.classList.remove('hidden');
    elements.quizOutputPanel.classList.add('flex');

    try {
        const res = await fetch(`${API_URL}/practice`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                text,
                type: quizType, // This var is global in script
                numQuestions: elements.numQuestions.value || 5,
                numMcq: elements.numMcq.value || 5
            })
        });
        const data = await res.json();

        let html = '<div class="space-y-6">';

        if (data.questions && data.questions.length > 0) {
            html += '<h3 class="text-blue-400 font-bold text-lg sticky top-0 bg-black/95 py-2 z-10">Questions</h3>';
            data.questions.forEach((q, i) => {
                html += `
                    <div class="glass-card text-left p-4 border-blue-500/20">
                        <p class="font-bold mb-2 text-white">${i + 1}. ${q}</p>
                        <textarea class="w-full bg-black/30 rounded p-2 text-sm text-gray-300 border border-white/10 focus:border-blue-500/50 outline-none" placeholder="Your answer..."></textarea>
                    </div>
                `;
            });
        }

        if (data.mcq && data.mcq.length > 0) {
            html += '<h3 class="text-blue-400 font-bold text-lg mt-8 sticky top-0 bg-black/95 py-2 z-10">Multiple Choice</h3>';
            data.mcq.forEach((m, i) => {
                html += `
                    <div class="glass-card text-left p-4 border-blue-500/20">
                        <p class="font-bold mb-3 text-white">${m.question}</p>
                        <div class="space-y-2">
                            ${m.options.map(opt => `
                                <label class="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer border border-transparent hover:border-white/10 transition-all">
                                    <input type="radio" name="m${i}" class="text-blue-500 bg-black/50 border-white/20"> 
                                    <span class="text-sm text-gray-300">${opt}</span>
                                </label>`).join('')}
                        </div>
                    </div>
                `;
            });
        }
        html += '</div>';

        if (!data.questions?.length && !data.mcq?.length) {
            html = '<div class="text-center text-muted">No questions generated. Try more text.</div>';
        }

        elements.quizContent.innerHTML = html;

    } catch (e) {
        elements.quizContent.innerHTML = '<div class="text-red-400 text-center">Error generating quiz. Please try again.</div>';
        setTimeout(() => {
            elements.quizOutputPanel.classList.add('hidden');
            elements.quizInputContainer.classList.remove('hidden');
        }, 2000);
    } finally {
        btn.innerText = "Start Practice";
        btn.disabled = false;
    }
}

// Global Nav export for inline HTML onclicks if any (using EventListeners preferred now)
window.navigateTo = navigateTo;
