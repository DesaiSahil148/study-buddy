const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// --- Mock AI Logic ---

// Helper to simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Route: /summary
app.post('/summary', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    await delay(1500); // Simulate AI processing time

    // AI-style summary generation (Mock)
    const summary = {
        title: "Key Concept Summary",
        core_idea: text.substring(0, 100) + (text.length > 100 ? "..." : "") + " focuses on the fundamental aspects of the subject.",
        key_points: [
            "Important point extracted from the text.",
            "Another crucial detail regarding the topic.",
            "Third key insight that connects the ideas."
        ],
        conclusion: "In summary, this text highlights the importance of understanding the core mechanics."
    };

    res.json(summary);
});

// Route: /flashcards
app.post('/flashcards', async (req, res) => {
    const { text } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    await delay(1500);

    // Mock Flashcards
    const flashcards = [
        { q: "What is the main topic?", a: "The main topic is related to the provided text." },
        { q: "Define the key term.", a: "The key term allows specific functionality within the system." },
        { q: "Why is this important?", a: "It ensures stability and performance." },
        { q: "What is the result?", a: "A comprehensive understanding of the material." },
        { q: "How does it work?", a: "It operates by processing input and generating output." }
    ];

    res.json(flashcards);
});

// Route: /practice
app.post('/practice', async (req, res) => {
    const { text, type, numQuestions, numMcq } = req.body;
    if (!text) return res.status(400).json({ error: 'No text provided' });

    await delay(2000);

    let result = {
        questions: [],
        mcq: []
    };

    if (type === 'questions' || type === 'both') {
        const count = numQuestions || 5;
        for (let i = 1; i <= count; i++) {
            result.questions.push(`Explain the significance of concept ${i} from the text.`);
        }
    }

    if (type === 'mcq' || type === 'both') {
        const count = numMcq || 5;
        for (let i = 1; i <= count; i++) {
            result.mcq.push({
                question: `Question ${i}: Which of the following is true?`,
                options: ["Option A", "Option B", "Option C", "Option D"],
                correct: 0
            });
        }
    }

    res.json(result);
});

// Serve Frontend for root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
