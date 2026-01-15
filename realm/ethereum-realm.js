// ===========================
// ETHEREUM REALM - PURPLE PORTAL
// The Foundry JavaScript
// ===========================

// ===========================
// PORTAL ANIMATION
// ===========================

class PortalAnimation {
    constructor() {
        this.overlay = document.getElementById('portalOverlay');
        this.particlesContainer = document.getElementById('portalParticles');
        this.isAnimating = false;
    }

    createParticles(count = 30) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'portal-particle';

                // Random angle and distance
                const angle = Math.random() * Math.PI * 2;
                const distance = 100 + Math.random() * 150;
                const tx = Math.cos(angle) * distance;
                const ty = Math.sin(angle) * distance;

                particle.style.setProperty('--tx', `${tx}px`);
                particle.style.setProperty('--ty', `${ty}px`);
                particle.style.left = '50%';
                particle.style.top = '50%';
                particle.style.animationDelay = `${Math.random() * 0.5}s`;
                particle.style.animationDuration = `${1 + Math.random()}s`;

                this.particlesContainer.appendChild(particle);

                // Remove particle after animation
                setTimeout(() => particle.remove(), 2000);
            }, i * 50);
        }
    }

    show() {
        if (this.isAnimating) return;
        this.isAnimating = true;

        this.overlay.classList.add('active');

        // Start particle effects
        setTimeout(() => this.createParticles(40), 500);
        setTimeout(() => this.createParticles(30), 1500);

        // Expand and fade after animation
        setTimeout(() => {
            this.overlay.classList.add('expanding');
        }, 2500);

        // Hide overlay completely
        setTimeout(() => {
            this.overlay.classList.add('fade-out');
            setTimeout(() => {
                this.overlay.classList.remove('active', 'expanding', 'fade-out');
                this.isAnimating = false;
            }, 1000);
        }, 3500);
    }

    // Called when entering the realm from main page
    playEntryAnimation() {
        // Check if coming from main page
        const referrer = document.referrer;
        const fromMainPage = referrer.includes('index.html') ||
                            (referrer.endsWith('/') && !referrer.includes('ethereum'));

        // Also check URL parameter
        const urlParams = new URLSearchParams(window.location.search);
        const showPortal = urlParams.get('portal') === 'true';

        if (showPortal || fromMainPage) {
            this.show();
            // Remove the parameter from URL
            if (showPortal) {
                window.history.replaceState({}, '', window.location.pathname);
            }
        }
    }
}

// Initialize portal on page load
let portalAnimation;
document.addEventListener('DOMContentLoaded', () => {
    portalAnimation = new PortalAnimation();
    portalAnimation.playEntryAnimation();
});

// ===========================
// FAQ ACCORDION
// ===========================

function toggleFaq(faqNum) {
    const faqItem = document.querySelector(`[data-faq="${faqNum}"]`);
    const allFaqs = document.querySelectorAll('.faq-item');

    // Close all other FAQs
    allFaqs.forEach(item => {
        if (item !== faqItem) {
            item.classList.remove('active');
        }
    });

    // Toggle current FAQ
    faqItem.classList.toggle('active');
}

// ===========================
// REALM QUIZ
// ===========================

const quizQuestions = [
    {
        question: "What is Ethereum's primary innovation over Bitcoin?",
        options: ["Faster transactions", "Smart contracts", "Lower fees", "More coins"],
        correct: 1,
        explanation: "Ethereum's breakthrough is enabling smart contracts—self-executing code that runs on the blockchain."
    },
    {
        question: "What is 'gas' in Ethereum?",
        options: ["A type of token", "Computational fuel for transactions", "A mining reward", "A wallet feature"],
        correct: 1,
        explanation: "Gas is the computational fuel required to execute transactions and smart contracts on Ethereum."
    },
    {
        question: "What was 'The Merge'?",
        options: ["Two blockchains combining", "Transition from PoW to PoS", "A major security update", "Launch of ETH 2.0 token"],
        correct: 1,
        explanation: "The Merge was Ethereum's historic transition to Proof of Stake in 2022, reducing energy consumption by 99.95%."
    },
    {
        question: "What does EVM stand for?",
        options: [
            "Ethereum Virtual Machine",
            "Electronic Verification Method",
            "Encrypted Value Module",
            "Ether Validation Mechanism"
        ],
        correct: 0,
        explanation: "The Ethereum Virtual Machine (EVM) is the runtime environment for smart contracts on Ethereum."
    },
    {
        question: "Who is the co-founder of Ethereum?",
        options: ["Satoshi Nakamoto", "Vitalik Buterin", "Charles Hoskinson", "Gavin Wood"],
        correct: 1,
        explanation: "Vitalik Buterin proposed Ethereum in 2013 and is its most prominent co-founder."
    }
];

let currentQuestion = 0;
let score = 0;
let selectedOption = null;

function initQuiz() {
    currentQuestion = 0;
    score = 0;
    selectedOption = null;
    document.getElementById('quizResult').style.display = 'none';
    document.getElementById('quizQuestionContainer').style.display = 'block';
    renderQuestion();
}

function renderQuestion() {
    const question = quizQuestions[currentQuestion];
    const container = document.getElementById('quizQuestionContainer');
    const progressFill = document.getElementById('quizProgressFill');
    const progressText = document.getElementById('quizProgressText');

    // Update progress
    const progress = ((currentQuestion + 1) / quizQuestions.length) * 100;
    progressFill.style.width = `${progress}%`;
    progressText.textContent = `Question ${currentQuestion + 1} of ${quizQuestions.length}`;

    // Render question
    container.innerHTML = `
        <p class="realm-quiz-question">${question.question}</p>
        <div class="realm-quiz-options">
            ${question.options.map((option, index) => `
                <div class="realm-quiz-option" onclick="selectOption(${index})" data-index="${index}">
                    <span class="option-marker">${String.fromCharCode(65 + index)}</span>
                    <span class="option-content">${option}</span>
                </div>
            `).join('')}
        </div>
        <div class="quiz-actions">
            <button class="btn-purple" onclick="submitAnswer()" id="submitBtn">SUBMIT ANSWER</button>
        </div>
    `;
}

function selectOption(index) {
    selectedOption = index;

    // Update visual selection
    const options = document.querySelectorAll('.realm-quiz-option');
    options.forEach((opt, i) => {
        opt.classList.remove('selected');
        if (i === index) {
            opt.classList.add('selected');
        }
    });
}

function submitAnswer() {
    if (selectedOption === null) {
        showNotification('Please select an answer!', 'warning');
        return;
    }

    const question = quizQuestions[currentQuestion];
    const options = document.querySelectorAll('.realm-quiz-option');
    const submitBtn = document.getElementById('submitBtn');

    // Disable further selection
    submitBtn.disabled = true;

    // Show correct/incorrect
    options.forEach((opt, i) => {
        if (i === question.correct) {
            opt.classList.add('correct');
        } else if (i === selectedOption && i !== question.correct) {
            opt.classList.add('incorrect');
        }
    });

    // Update score
    if (selectedOption === question.correct) {
        score++;
    }

    // Move to next question or show results
    setTimeout(() => {
        currentQuestion++;
        selectedOption = null;

        if (currentQuestion < quizQuestions.length) {
            renderQuestion();
        } else {
            showResults();
        }
    }, 1500);
}

function showResults() {
    document.getElementById('quizQuestionContainer').style.display = 'none';
    const resultDiv = document.getElementById('quizResult');
    const resultIcon = document.getElementById('resultIcon');
    const resultTitle = document.getElementById('resultTitle');
    const resultMessage = document.getElementById('resultMessage');

    resultDiv.style.display = 'block';

    const percentage = (score / quizQuestions.length) * 100;

    if (percentage >= 80) {
        resultIcon.textContent = '◆';
        resultIcon.style.color = '#8B7DFF';
        resultTitle.textContent = 'FOUNDRY MASTER';
        resultMessage.innerHTML = `
            Impressive, Builder! You scored <strong>${score}/${quizQuestions.length}</strong>.<br><br>
            Your understanding of The Foundry is profound.
            You have proven yourself worthy of building in this realm.
        `;
    } else if (percentage >= 60) {
        resultIcon.textContent = '◇';
        resultIcon.style.color = '#6366F1';
        resultTitle.textContent = 'RISING BUILDER';
        resultMessage.innerHTML = `
            Well done! You scored <strong>${score}/${quizQuestions.length}</strong>.<br><br>
            Your knowledge grows, but there is still more to learn.
            Return to study the powers of The Foundry.
        `;
    } else {
        resultIcon.textContent = '○';
        resultIcon.style.color = '#5B21B6';
        resultTitle.textContent = 'NOVICE BUILDER';
        resultMessage.innerHTML = `
            You scored <strong>${score}/${quizQuestions.length}</strong>.<br><br>
            The path to understanding is long, but every journey begins with a single step.
            Study The Foundry's wisdom and return stronger.
        `;
    }
}

function restartQuiz() {
    initQuiz();
}

// Initialize quiz on page load
document.addEventListener('DOMContentLoaded', () => {
    initQuiz();
});

// ===========================
// NOTIFICATION SYSTEM (reuse from main)
// ===========================

function showNotification(message, type = 'info') {
    const existing = document.querySelector('.notification');
    if (existing) existing.remove();

    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '15px 30px',
        background: type === 'success' ? 'hsla(120, 100%, 40%, 0.9)' :
                   type === 'warning' ? 'hsla(40, 100%, 50%, 0.9)' :
                   'hsla(250, 100%, 74%, 0.9)',
        color: type === 'warning' ? 'hsl(0, 0%, 10%)' : 'hsl(0, 0%, 100%)',
        borderRadius: '4px',
        fontFamily: 'Orbitron, sans-serif',
        fontSize: '0.85rem',
        fontWeight: '600',
        letterSpacing: '0.1rem',
        textTransform: 'uppercase',
        zIndex: '10000',
        boxShadow: '0 0 30px hsla(0, 0%, 0%, 0.5)',
        animation: 'notificationSlideIn 0.3s ease-out'
    });

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.animation = 'notificationSlideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ===========================
// CONSOLE EASTER EGG
// ===========================

console.log(`
%c╔═══════════════════════════════════════╗
║                                       ║
║        THE FOUNDRY ACTIVATED          ║
║                                       ║
║   The Realm of Creation welcomes you. ║
║   Build. Create. Innovate. ◆          ║
║                                       ║
╚═══════════════════════════════════════╝
`, 'color: #8B7DFF; font-family: monospace; font-size: 12px;');
