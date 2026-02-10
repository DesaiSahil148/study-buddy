import { showToast } from './utils.js';

// --- Global UI State ---
let currentFlashcards = [];
let currentCardIndex = 0;
let isFlipped = false;

// --- Summary UI ---
export const renderSummary = (data) => {
    const content = document.getElementById('summary-content');
    const panel = document.getElementById('summary-output-panel');

    const html = `
        <h3 class="text-cyan-400 mb-2 font-bold text-lg">${data.title}</h3>
        <p class="mb-4 text-white/90">${data.core_idea}</p>
        <ul class="list-disc pl-5 text-muted space-y-2">
            ${data.key_points.map(p => `<li>${p}</li>`).join('')}
        </ul>
        <p class="mt-4 text-sm text-gray-400 italic">${data.conclusion}</p>
    `;

    content.innerHTML = html;
    panel.classList.remove('hidden');
    panel.classList.add('flex');
    showToast('Summary Generated!', 'success');
};

export const closeSummary = () => {
    const panel = document.getElementById('summary-output-panel');
    panel.classList.add('hidden');
    panel.classList.remove('flex');
};

// --- Flashcard UI ---
export const setupFlashcards = (data) => {
    currentFlashcards = data;
    currentCardIndex = 0;
    isFlipped = false;

    const inputContainer = document.getElementById('flashcard-input-container');
    const outputPanel = document.getElementById('flashcards-output-panel');

    inputContainer.classList.add('hidden');
    outputPanel.classList.remove('hidden');
    outputPanel.classList.add('flex');

    renderCurrentCard();
    showToast(`${data.length} Flashcards Created!`, 'success');
};

export const closeFlashcards = () => {
    const inputContainer = document.getElementById('flashcard-input-container');
    const outputPanel = document.getElementById('flashcards-output-panel');

    outputPanel.classList.add('hidden');
    outputPanel.classList.remove('flex');
    inputContainer.classList.remove('hidden');

    // Clear state
    currentFlashcards = [];
    currentCardIndex = 0;
};

export const flipCard = () => {
    if (!currentFlashcards.length) return;
    isFlipped = !isFlipped;
    renderCurrentCard();
};

export const nextCard = () => {
    if (!currentFlashcards.length) return;
    if (currentCardIndex < currentFlashcards.length - 1) {
        currentCardIndex++;
        isFlipped = false; // Reset flip on nav
        renderCurrentCard();
    } else {
        showToast('End of deck', 'info');
    }
};

export const prevCard = () => {
    if (!currentFlashcards.length) return;
    if (currentCardIndex > 0) {
        currentCardIndex--;
        isFlipped = false;
        renderCurrentCard();
    }
};

function renderCurrentCard() {
    const display = document.getElementById('flashcard-display');
    const counter = document.getElementById('flashcard-counter');
    const card = currentFlashcards[currentCardIndex];

    // Counter
    counter.innerText = `${currentCardIndex + 1} / ${currentFlashcards.length}`;

    // Card Content
    if (isFlipped) {
        display.innerHTML = `
            <div class="absolute top-4 right-4 text-purple-400 opacity-50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M12 4v16"/></svg>
            </div>
            <div class="fade-in w-full">
                <h4 class="text-white font-bold mb-3 text-lg border-b border-purple-500/30 pb-2">Answer</h4>
                <p class="text-lg text-purple-200 leading-relaxed">${card.a}</p>
            </div>
        `;
        display.style.borderColor = 'rgba(192, 132, 252, 0.6)';
        display.style.backgroundColor = 'rgba(192, 132, 252, 0.1)';
    } else {
        display.innerHTML = `
            <div class="absolute top-4 right-4 text-purple-400 opacity-50">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><path d="M12 4v16"/></svg>
            </div>
            <div class="fade-in w-full">
                <h4 class="text-purple-300 font-bold mb-3 text-lg border-b border-white/10 pb-2">Question</h4>
                <p class="text-lg text-gray-300 leading-relaxed">${card.q}</p>
            </div>
        `;
        display.style.borderColor = '';
        display.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';
    }
}

// --- Practice UI ---
export const renderQuiz = (data) => {
    const inputContainer = document.getElementById('quiz-input-container');
    const outputPanel = document.getElementById('quiz-output-panel');
    const content = document.getElementById('quiz-content');

    let html = '<div class="space-y-6">';

    if (data.questions && data.questions.length > 0) {
        html += '<h3 class="text-blue-400 font-bold text-lg sticky top-0 bg-black/95 py-2 z-10 border-b border-blue-500/20">Questions</h3>';
        data.questions.forEach((q, i) => {
            html += `
                    <div class="glass-card text-left p-4 border-blue-500/20 hover:border-blue-500/40 transition-colors">
                        <p class="font-bold mb-2 text-white">${i + 1}. ${q}</p>
                        <textarea class="w-full bg-black/30 rounded p-2 text-sm text-gray-300 border border-white/10 focus:border-blue-500/50 outline-none resize-y min-h-[60px]" placeholder="Your answer..."></textarea>
                    </div>
                `;
        });
    }

    if (data.mcq && data.mcq.length > 0) {
        html += '<h3 class="text-blue-400 font-bold text-lg mt-8 sticky top-0 bg-black/95 py-2 z-10 border-b border-blue-500/20">Multiple Choice</h3>';
        data.mcq.forEach((m, i) => {
            html += `
                    <div class="glass-card text-left p-4 border-blue-500/20 hover:border-blue-500/40 transition-colors">
                        <p class="font-bold mb-3 text-white">${m.question}</p>
                        <div class="space-y-2">
                            ${m.options.map(opt => `
                                <label class="flex items-center gap-3 p-3 hover:bg-white/5 rounded-lg cursor-pointer border border-transparent hover:border-white/10 transition-all group">
                                    <input type="radio" name="m${i}" class="text-blue-500 bg-black/50 border-white/20 focus:ring-blue-500"> 
                                    <span class="text-sm text-gray-300 group-hover:text-white transition-colors">${opt}</span>
                                </label>`).join('')}
                        </div>
                    </div>
                `;
        });
    }
    html += '</div>';

    if (!data.questions?.length && !data.mcq?.length) {
        html = '<div class="text-center text-muted py-8">No questions generated. Try using different text.</div>';
    }

    content.innerHTML = html;
    inputContainer.classList.add('hidden');
    outputPanel.classList.remove('hidden');
    outputPanel.classList.add('flex');
    showToast('Quiz Ready!', 'success');
};

export const closeQuiz = () => {
    const inputContainer = document.getElementById('quiz-input-container');
    const outputPanel = document.getElementById('quiz-output-panel');

    outputPanel.classList.add('hidden');
    outputPanel.classList.remove('flex');
    inputContainer.classList.remove('hidden');
};
