const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

exports.generateSummary = async (text) => {
    await delay(1500); // Simulate processing
    return {
        title: "Key Concept Summary",
        core_idea: text.substring(0, 100) + (text.length > 100 ? "..." : "") + " focuses on the fundamental aspects of the subject.",
        key_points: [
            "Important point extracted from the text.",
            "Another crucial detail regarding the topic.",
            "Third key insight that connects the ideas."
        ],
        conclusion: "In summary, this text highlights the importance of understanding the core mechanics."
    };
};

exports.generateFlashcards = async (text) => {
    await delay(1500);
    return [
        { q: "What is the main topic?", a: "The main topic is related to the provided text." },
        { q: "Define the key term.", a: "The key term allows specific functionality within the system." },
        { q: "Why is this important?", a: "It ensures stability and performance." },
        { q: "What is the result?", a: "A comprehensive understanding of the material." },
        { q: "How does it work?", a: "It operates by processing input and generating output." }
    ];
};

exports.generatePractice = async (text, type, numQuestions, numMcq) => {
    await delay(2000);
    const result = { questions: [], mcq: [] };

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
    return result;
};
