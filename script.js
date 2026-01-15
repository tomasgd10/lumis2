// ===========================
// LUMIS 2.0 - INTERACTIVE JOURNEY
// ===========================

// Journey Progress State
let journeyState = {
    completedArcs: [],
    selectedAnswers: {}
};

// Load progress from localStorage on page load
window.addEventListener('DOMContentLoaded', () => {
    loadProgress();
    updateUI();
    initScrollEffects();
    initSidebarNav();
});

// ===========================
// JOURNEY ARC FUNCTIONS
// ===========================

function toggleArc(arcNum) {
    const arc = document.querySelector(`[data-arc="${arcNum}"]`);
    const content = document.getElementById(`content-${arcNum}`);

    // Check if arc is locked
    if (arc.classList.contains('locked') && arcNum > 1) {
        // Check if previous arc is completed
        if (!journeyState.completedArcs.includes(arcNum - 1)) {
            showNotification(`Complete Arc ${arcNum - 1} first!`, 'warning');
            return;
        }
    }

    // Toggle expanded state
    arc.classList.toggle('expanded');
}

function selectQuizOption(arcNum, optionIndex) {
    // Remove previous selection
    const options = document.querySelectorAll(`[data-arc="${arcNum}"] .quiz-option`);
    options.forEach(opt => opt.classList.remove('selected'));

    // Add selection to clicked option
    options[optionIndex].classList.add('selected');

    // Store selected answer
    journeyState.selectedAnswers[arcNum] = optionIndex;
}

function submitQuiz(arcNum, correctAnswer) {
    const selectedAnswer = journeyState.selectedAnswers[arcNum];
    const feedback = document.getElementById(`feedback-${arcNum}`);
    const options = document.querySelectorAll(`[data-arc="${arcNum}"] .quiz-option`);

    // Check if an answer is selected
    if (selectedAnswer === undefined) {
        showNotification('Please select an answer first!', 'warning');
        return;
    }

    // Mark correct/incorrect visually
    options.forEach((opt, idx) => {
        if (idx === correctAnswer) {
            opt.classList.add('correct');
        } else if (idx === selectedAnswer && idx !== correctAnswer) {
            opt.classList.add('incorrect');
        }
    });

    // Show feedback
    feedback.classList.add('show');

    if (selectedAnswer === correctAnswer) {
        // Correct answer
        feedback.classList.add('correct');
        feedback.classList.remove('incorrect');
        feedback.innerHTML = `
            <strong>✓ CORRECT!</strong>
            Your wisdom grows, Seeker. The path ahead illuminates.
        `;

        // Mark arc as completed
        if (!journeyState.completedArcs.includes(arcNum)) {
            journeyState.completedArcs.push(arcNum);
            saveProgress();

            // Unlock next arc
            if (arcNum < 5) {
                const nextArc = document.querySelector(`[data-arc="${arcNum + 1}"]`);
                nextArc.classList.remove('locked');
                showNotification(`Arc ${arcNum + 1} unlocked!`, 'success');
            }

            // Check if all arcs completed
            if (arcNum === 5) {
                setTimeout(() => {
                    showCompletionCelebration();
                }, 1000);
            }

            updateUI();
        }
    } else {
        // Incorrect answer
        feedback.classList.add('incorrect');
        feedback.classList.remove('correct');
        feedback.innerHTML = `
            <strong>✗ NOT QUITE...</strong>
            Study the lessons above and try again, Seeker.
        `;

        // Reset selection after 2 seconds
        setTimeout(() => {
            options.forEach(opt => {
                opt.classList.remove('correct', 'incorrect', 'selected');
            });
            feedback.classList.remove('show');
            delete journeyState.selectedAnswers[arcNum];
        }, 2000);
    }
}

// ===========================
// UI UPDATE FUNCTIONS
// ===========================

function updateUI() {
    // Update progress bar
    const completedCount = journeyState.completedArcs.length;
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');

    const percentage = (completedCount / 5) * 100;
    progressBar.style.width = `${percentage}%`;
    progressText.textContent = `${completedCount} / 5 ARCS COMPLETED`;

    // Update arc statuses
    for (let i = 1; i <= 5; i++) {
        const arc = document.querySelector(`[data-arc="${i}"]`);
        const status = document.getElementById(`status-${i}`);

        if (journeyState.completedArcs.includes(i)) {
            // Completed
            arc.classList.remove('locked');
            arc.classList.add('completed');
            status.innerHTML = `
                <span class="status-icon">✓</span>
                <span class="status-text">COMPLETED</span>
            `;
        } else if (i === 1 || journeyState.completedArcs.includes(i - 1)) {
            // Available
            arc.classList.remove('locked');
            status.innerHTML = `
                <span class="status-icon">◆</span>
                <span class="status-text">AVAILABLE</span>
            `;
        } else {
            // Locked
            arc.classList.add('locked');
            status.innerHTML = `
                <span class="status-icon">🔒</span>
                <span class="status-text">LOCKED</span>
            `;
        }
    }
}

// ===========================
// PERSISTENCE FUNCTIONS
// ===========================

function saveProgress() {
    localStorage.setItem('lumis-journey-progress', JSON.stringify(journeyState));
}

function loadProgress() {
    const saved = localStorage.getItem('lumis-journey-progress');
    if (saved) {
        journeyState = JSON.parse(saved);
    }
}

function resetProgress() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
        journeyState = {
            completedArcs: [],
            selectedAnswers: {}
        };
        saveProgress();
        location.reload();
    }
}

// ===========================
// NOTIFICATION SYSTEM
// ===========================

function showNotification(message, type = 'info') {
    // Remove existing notification if any
    const existing = document.querySelector('.notification');
    if (existing) {
        existing.remove();
    }

    // Create notification
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Style notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '15px 30px',
        background: type === 'success' ? 'hsla(120, 100%, 40%, 0.9)' :
                   type === 'warning' ? 'hsla(40, 100%, 50%, 0.9)' :
                   'hsla(180, 100%, 43%, 0.9)',
        color: 'hsl(0, 0%, 100%)',
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

    // Add to page
    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'notificationSlideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Add notification animations
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes notificationSlideIn {
        from {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
    }

    @keyframes notificationSlideOut {
        from {
            opacity: 1;
            transform: translateX(-50%) translateY(0);
        }
        to {
            opacity: 0;
            transform: translateX(-50%) translateY(-20px);
        }
    }
`;
document.head.appendChild(notificationStyles);

// ===========================
// COMPLETION CELEBRATION
// ===========================

function showCompletionCelebration() {
    // Create celebration overlay
    const overlay = document.createElement('div');
    overlay.className = 'completion-overlay';

    overlay.innerHTML = `
        <div class="completion-content">
            <div class="completion-icon">✧</div>
            <h2 class="completion-title">
                <span class="blue-text">LUMINARI</span> <span class="orange-text">ACHIEVED</span>
            </h2>
            <p class="completion-message">
                You have completed all five arcs of wisdom, Seeker.<br>
                You are now a <strong>Luminari</strong> – a guide of the Lumisverse.<br><br>
                The light multiplies through you. Share your wisdom. Guide others.<br>
                The journey continues, but you walk it as an enlightened one.
            </p>
            <button class="btn-cyber-filled" onclick="closeCompletion()">EMBRACE THE LIGHT</button>
        </div>
    `;

    // Style overlay
    Object.assign(overlay.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        background: 'hsla(202, 60%, 5%, 0.95)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: '10000',
        animation: 'fadeIn 0.5s ease-out'
    });

    document.body.appendChild(overlay);
}

function closeCompletion() {
    const overlay = document.querySelector('.completion-overlay');
    if (overlay) {
        overlay.style.animation = 'fadeOut 0.5s ease-out';
        setTimeout(() => overlay.remove(), 500);
    }
}

// Add completion styles
const completionStyles = document.createElement('style');
completionStyles.textContent = `
    .completion-content {
        text-align: center;
        max-width: 600px;
        padding: 60px;
        background: hsla(202, 50%, 10%, 0.9);
        border: 2px solid var(--cyber-cyan);
        border-radius: 4px;
        box-shadow: var(--glow-cyan);
    }

    .completion-icon {
        font-size: 5rem;
        color: var(--cyber-cyan);
        margin-bottom: 30px;
        animation: float 3s ease-in-out infinite;
    }

    .completion-title {
        font-family: 'Cinzel', serif;
        font-size: 2.5rem;
        font-weight: 900;
        letter-spacing: 0.2rem;
        margin-bottom: 30px;
    }

    .completion-message {
        font-size: 1rem;
        line-height: 1.8;
        color: var(--muted-foreground);
        margin-bottom: 40px;
    }

    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }

    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
`;
document.head.appendChild(completionStyles);

// ===========================
// SCROLL EFFECTS
// ===========================

// Smooth scroll duration for navigation links
const SCROLL_DURATION = 1000;
let isScrolling = false;

function smoothScrollTo(targetY, duration) {
    if (isScrolling) return;
    isScrolling = true;

    const startY = window.scrollY;
    const difference = targetY - startY;
    const startTime = performance.now();

    function step(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease in-out cubic
        const ease = progress < 0.5
            ? 4 * progress * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 3) / 2;

        window.scrollTo(0, startY + difference * ease);

        if (progress < 1) {
            requestAnimationFrame(step);
        } else {
            isScrolling = false;
        }
    }

    requestAnimationFrame(step);
}

function scrollToElement(element, duration = SCROLL_DURATION) {
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const targetY = window.scrollY + rect.top;
    smoothScrollTo(targetY, duration);
}

function initScrollEffects() {
    const scrollThumb = document.querySelector('.scroll-indicator-thumb');
    const logo = document.querySelector('.logo');
    const heroSection = document.getElementById('hero');

    // Update scroll indicator on scroll
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercentage = scrollHeight > 0 ? scrollTop / scrollHeight : 0;
        const thumbPosition = scrollPercentage * 80;
        if (scrollThumb) {
            scrollThumb.style.top = `${thumbPosition}%`;
        }

        // Show/hide logo based on scroll position
        if (logo && heroSection) {
            const heroBottom = heroSection.offsetTop + heroSection.offsetHeight;
            if (scrollTop > heroBottom - 100) {
                logo.classList.add('visible');
            } else {
                logo.classList.remove('visible');
            }
        }

        updateActiveSidebarLink();
    });
}

function updateActiveSidebarLink() {
    const sections = document.querySelectorAll('.section');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    let activeSection = null;

    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= 200 && rect.bottom >= 200) {
            activeSection = section.id;
        }
    });

    if (activeSection) {
        sidebarLinks.forEach(link => {
            if (link.dataset.section === activeSection) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
}

// ===========================
// SIDEBAR NAVIGATION
// ===========================

function initSidebarNav() {
    const sidebarLinks = document.querySelectorAll('.sidebar-link');

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                scrollToElement(targetSection, SCROLL_DURATION);
            }
        });
    });
}

// ===========================
// UTILITY: SMOOTH SCROLL
// ===========================

function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        scrollToElement(section, SCROLL_DURATION);
    }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            scrollToElement(target, SCROLL_DURATION);
        }
    });
});

// ===========================
// DEVELOPER CONSOLE EASTER EGG
// ===========================

console.log(`
%c╔═══════════════════════════════════════╗
║                                       ║
║           LUMIS 2.0 LOADED            ║
║                                       ║
║   The Chains are calling, Seeker.    ║
║     Your journey has begun. ✧        ║
║                                       ║
╚═══════════════════════════════════════╝
`, 'color: #00d4ff; font-family: monospace; font-size: 12px;');

console.log('%cDeveloper Commands:', 'color: #ff7f50; font-weight: bold; font-size: 14px;');
console.log('%cresetProgress() %c- Reset all journey progress', 'color: #00d4ff', 'color: #999');
console.log('%cjourneyState %c- View current progress', 'color: #00d4ff', 'color: #999');

// ===========================
// LUMIS LETTER GLOW CYCLE
// ===========================

// Smooth pulsing glow animation using JavaScript
document.addEventListener('DOMContentLoaded', () => {
    const letters = document.querySelectorAll('.hero-letter');
    if (letters.length === 0) return;

    let brightness = 0;
    let direction = 1;
    const stepSize = 5; // 5% per step
    const intervalMs = 250; // 0.25s per step

    function getStylesForBrightness(level) {
        const intensity = level / 100;

        // FILTER: Glow effect around letters
        const glowSize = 15 + (intensity * 25); // 15px to 40px
        const glowOpacity = 0.2 + (intensity * 0.6); // 0.2 to 0.8
        let filter = `drop-shadow(0 0 ${glowSize}px hsla(180, 100%, 50%, ${glowOpacity}))`;
        if (intensity > 0.3) {
            const outerOpacity = (intensity - 0.3) * 0.5;
            filter += ` drop-shadow(0 0 ${glowSize * 2}px hsla(180, 100%, 60%, ${outerOpacity}))`;
        }
        filter += ` drop-shadow(0 4px 8px hsla(0, 0%, 0%, 0.5))`;

        // BACKGROUND: Letter color from grey to cyan
        // At 0%: grey (#a0a0a0)
        // At 100%: bright cyan (#00f3ff)
        const greyValue = Math.round(160 - (intensity * 160)); // 160 to 0
        const cyanMix = intensity; // 0 to 1

        // Interpolate between grey and cyan
        const r = Math.round(160 * (1 - cyanMix) + 0 * cyanMix);
        const g = Math.round(160 * (1 - cyanMix) + 220 * cyanMix);
        const b = Math.round(160 * (1 - cyanMix) + 255 * cyanMix);

        const topColor = `rgb(${Math.min(255, r + 40)}, ${Math.min(255, g + 40)}, ${Math.min(255, b + 40)})`;
        const midColor = `rgb(${r}, ${g}, ${b})`;
        const botColor = `rgb(${Math.max(0, r - 20)}, ${Math.max(0, g - 20)}, ${Math.max(0, b - 20)})`;

        const background = `linear-gradient(180deg, ${topColor} 0%, ${midColor} 50%, ${botColor} 100%)`;

        return { filter, background };
    }

    function step() {
        brightness += stepSize * direction;

        // Reverse at boundaries
        if (brightness >= 100) {
            brightness = 100;
            direction = -1;
        } else if (brightness <= 0) {
            brightness = 0;
            direction = 1;
        }

        const styles = getStylesForBrightness(brightness);
        letters.forEach(letter => {
            letter.style.setProperty('filter', styles.filter, 'important');
            letter.style.setProperty('background', styles.background, 'important');
            letter.style.setProperty('-webkit-background-clip', 'text', 'important');
            letter.style.setProperty('background-clip', 'text', 'important');
        });

    }

    // Wait for initial reveal animation to complete, then start pulsing
    setTimeout(() => {
        setInterval(step, intervalMs);
    }, 2000);
});

// ===========================
// REALM PORTAL TRANSITION
// ===========================

function enterRealm(realmName, portalColor = 'gold') {
    const overlay = document.getElementById('portalOverlay');
    const particlesContainer = document.getElementById('portalParticles');

    if (!overlay) return;

    // Set portal color theme
    overlay.classList.remove('purple-portal', 'red-portal');
    if (portalColor === 'purple') {
        overlay.classList.add('purple-portal');
    } else if (portalColor === 'red') {
        overlay.classList.add('red-portal');
    }

    // Show portal overlay
    overlay.classList.add('active');

    // Particle color based on portal type
    const particleColors = {
        'purple': '#8B7DFF',
        'red': '#EF4444',
        'gold': '#FFD700'
    };
    const particleColor = particleColors[portalColor] || '#FFD700';

    // Create particles
    function createParticles(count) {
        for (let i = 0; i < count; i++) {
            setTimeout(() => {
                const particle = document.createElement('div');
                particle.className = 'portal-particle';

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
                particle.style.background = particleColor;

                particlesContainer.appendChild(particle);

                setTimeout(() => particle.remove(), 2000);
            }, i * 50);
        }
    }

    // Start particle effects
    setTimeout(() => createParticles(40), 500);
    setTimeout(() => createParticles(30), 1500);

    // Expand portal and navigate
    setTimeout(() => {
        overlay.classList.add('expanding');
    }, 2500);

    // Navigate to realm page
    setTimeout(() => {
        window.location.href = `realm/${realmName}.html?portal=true`;
    }, 3200);
}
