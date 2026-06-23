/**
 * MedPrep - Core Application Logic
 * Implementa el motor de preguntas con distractores dinámicos,
 * persistencia local, filtrado por categorías, biblioteca y creador de exámenes.
 */

// Application State
let questions = [];
let filteredQuestions = [];
let currentQuestionIndex = 0;
let activeCategory = 'Todos';

// Quiz State for Current Question
let currentOptions = [];
let eliminatedOptions = [];
let activeDistractors = [];
let currentDistractorPool = [];
let isAnswered = false;

// Statistics
let stats = {
    streak: 0,
    totalSolved: 0,
    correctCount: 0,
    score: 0,
    attempts: 0
};

// DOM Elements Cache
const elements = {
    themeToggle: document.getElementById('theme-toggle'),
    categoriesList: document.getElementById('categories-list'),
    questionCategory: document.getElementById('question-category'),
    questionDifficulty: document.getElementById('question-difficulty'),
    questionText: document.getElementById('question-text'),
    optionsContainer: document.getElementById('options-container'),
    feedbackPanel: document.getElementById('feedback-panel'),
    feedbackIcon: document.getElementById('feedback-icon'),
    feedbackTitle: document.getElementById('feedback-title'),
    feedbackSubtitle: document.getElementById('feedback-subtitle'),
    feedbackExplanation: document.getElementById('feedback-explanation'),
    feedbackMnemonic: document.getElementById('feedback-mnemonic'),
    feedbackMnemonicWrapper: document.getElementById('feedback-mnemonic-wrapper'),
    btnChallengeAgain: document.getElementById('btn-challenge-again'),
    btnNextQuestion: document.getElementById('btn-next-question'),
    
    // Stats elements
    statStreak: document.getElementById('stat-streak'),
    statAccuracy: document.getElementById('stat-accuracy'),
    statSolved: document.getElementById('stat-solved'),
    statScore: document.getElementById('stat-score'),
    statLevelPercent: document.getElementById('stat-level-percent'),
    statLevelBar: document.getElementById('stat-level-bar'),
    btnResetProgress: document.getElementById('btn-reset-progress'),
    
    // Guide elements
    guideSearch: document.getElementById('guide-search'),
    guideGrid: document.getElementById('guide-grid'),
    
    // Custom exam elements
    customForm: document.getElementById('custom-question-form'),
    customQuestionsCount: document.getElementById('custom-questions-count'),
    customQuestionsList: document.getElementById('custom-questions-list'),
    btnExportQuestions: document.getElementById('btn-export-questions'),
    importFileInput: document.getElementById('import-file-input'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message')
};

// Initialize Application
document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    loadStats();
    loadQuestions();
    setupEventListeners();
    
    // Start with the first question
    filterQuestions();
    if (filteredQuestions.length > 0) {
        loadQuestion(0);
    }
    
    updateStatsUI();
    renderCategories();
    renderGuide();
    renderCustomQuestionsList();
});

// Setup Event Listeners
function setupEventListeners() {
    // Theme toggle
    elements.themeToggle.addEventListener('click', toggleTheme);
    
    // Next question
    elements.btnNextQuestion.addEventListener('click', nextQuestion);
    
    // Challenge again (reshuffle distractors on current question)
    elements.btnChallengeAgain.addEventListener('click', challengeAgain);
    
    // Reset stats
    elements.btnResetProgress.addEventListener('click', resetProgress);
    
    // Guide Search
    elements.guideSearch.addEventListener('input', renderGuide);
    
    // Custom question form submit
    elements.customForm.addEventListener('submit', handleCustomQuestionSubmit);
    
    // Export/Import Custom Questions
    elements.btnExportQuestions.addEventListener('click', exportCustomQuestions);
    elements.importFileInput.addEventListener('change', importCustomQuestions);
}

// Load Questions (Default + Custom from LocalStorage)
function loadQuestions() {
    const customQs = JSON.parse(localStorage.getItem('medprep_custom_questions')) || [];
    questions = [...DEFAULT_QUESTIONS, ...customQs];
}

// Filter Questions by Selected Category
function filterQuestions() {
    if (activeCategory === 'Todos') {
        filteredQuestions = shuffleArray([...questions]);
    } else {
        filteredQuestions = shuffleArray(questions.filter(q => q.category === activeCategory));
    }
    
    // If category has no questions (e.g., deleted), fall back to Todos
    if (filteredQuestions.length === 0) {
        activeCategory = 'Todos';
        filteredQuestions = shuffleArray([...questions]);
    }
}

// Render Categories List in Sidebar
function renderCategories() {
    const categoriesMap = {};
    questions.forEach(q => {
        categoriesMap[q.category] = (categoriesMap[q.category] || 0) + 1;
    });
    
    let html = `
        <button class="category-filter-btn ${activeCategory === 'Todos' ? 'active' : ''}" onclick="selectCategory('Todos')">
            <span><i class="fa-solid fa-list-ul"></i> Todos los Temas</span>
            <span class="category-count">${questions.length}</span>
        </button>
    `;
    
    Object.keys(categoriesMap).forEach(cat => {
        html += `
            <button class="category-filter-btn ${activeCategory === cat ? 'active' : ''}" onclick="selectCategory('${cat}')">
                <span><i class="fa-solid fa-folder-open"></i> ${cat}</span>
                <span class="category-count">${categoriesMap[cat]}</span>
            </button>
        `;
    });
    
    elements.categoriesList.innerHTML = html;
}

// Change Active Category
function selectCategory(category) {
    activeCategory = category;
    renderCategories();
    filterQuestions();
    
    if (filteredQuestions.length > 0) {
        loadQuestion(0);
    } else {
        showToast("No hay preguntas en esta categoría.");
    }
}

// Load a specific question
function loadQuestion(index) {
    if (filteredQuestions.length === 0) return;
    
    // Safe bounds
    if (index >= filteredQuestions.length) {
        index = 0;
    }
    
    currentQuestionIndex = index;
    const q = filteredQuestions[index];
    isAnswered = false;
    eliminatedOptions = [];
    
    // Setup initial distractors: start with question's own incorrect answers
    currentDistractorPool = [...q.distractors];
    
    // If the question is multiple choice (more than 1 distractor),
    // inflate the pool with random incorrect answers from other React questions
    if (q.distractors.length > 1) {
        const globalDistractors = [];
        questions.forEach(otherQ => {
            if (otherQ.id !== q.id) {
                otherQ.distractors.forEach(dist => {
                    // Avoid duplicate strings, booleans, or matching the current correct answer
                    if (!globalDistractors.includes(dist) && 
                        dist !== "Verdadero" && 
                        dist !== "Falso" && 
                        dist !== q.correct &&
                        dist.length > 1) {
                        globalDistractors.push(dist);
                    }
                });
            }
        });
        
        // Shuffle and take up to 8 extra distractors to enrich the pool
        shuffleArray(globalDistractors);
        const extraDistractors = globalDistractors.slice(0, 8);
        currentDistractorPool.push(...extraDistractors);
    }
    
    // Shuffle the enriched pool and select 3 active distractors
    shuffleArray(currentDistractorPool);
    activeDistractors = currentDistractorPool.slice(0, Math.min(3, currentDistractorPool.length));
    
    // Combine correct option and active distractors
    currentOptions = [q.correct, ...activeDistractors];
    shuffleArray(currentOptions);
    
    // Render question details
    elements.questionCategory.textContent = q.category;
    elements.questionDifficulty.textContent = q.difficulty;
    
    // Update difficulty dots
    const dots = document.querySelectorAll('.difficulty-indicator .dot');
    dots.forEach((dot, idx) => {
        if (q.difficulty === 'Fácil') {
            dot.className = idx === 0 ? 'dot active' : 'dot';
        } else if (q.difficulty === 'Intermedio') {
            dot.className = idx <= 1 ? 'dot active' : 'dot';
        } else {
            dot.className = 'dot active';
        }
    });
    
    elements.questionText.textContent = q.question;
    
    // Hide feedback panel
    elements.feedbackPanel.style.display = 'none';
    elements.feedbackPanel.className = 'feedback-panel';
    
    renderOptionsUI();
}

// Render Option Buttons
function renderOptionsUI() {
    elements.optionsContainer.innerHTML = '';
    
    currentOptions.forEach((option, idx) => {
        const letter = String.fromCharCode(65 + idx); // A, B, C, D
        const button = document.createElement('button');
        button.className = 'option-btn option-fade-in';
        button.style.animationDelay = `${idx * 0.08}s`;
        button.disabled = isAnswered;
        
        // If option was already eliminated (during dynamic changes)
        if (eliminatedOptions.includes(option)) {
            button.classList.add('selected-incorrect');
            button.disabled = true;
        }
        
        button.innerHTML = `
            <span class="option-letter">${letter}</span>
            <span class="option-text-content">${option}</span>
        `;
        
        button.addEventListener('click', () => handleOptionSelection(option, button));
        elements.optionsContainer.appendChild(button);
    });
}

// Handle Option Click
function handleOptionSelection(selectedOption, buttonEl) {
    const q = filteredQuestions[currentQuestionIndex];
    if (isAnswered) return;
    
    stats.attempts++;
    
    if (selectedOption === q.correct) {
        // Correct Answer
        isAnswered = true;
        buttonEl.classList.add('selected-correct');
        
        // Calculate points (bonus for no mistakes)
        const basePoints = 10;
        const mistakePenalty = eliminatedOptions.length * 2;
        const pointsGained = Math.max(4, basePoints - mistakePenalty);
        
        stats.streak++;
        stats.correctCount++;
        stats.totalSolved++;
        stats.score += pointsGained;
        
        saveStats();
        updateStatsUI();
        
        // Disable all buttons
        const allButtons = elements.optionsContainer.querySelectorAll('.option-btn');
        allButtons.forEach(btn => {
            btn.disabled = true;
            if (btn.querySelector('.option-text-content').textContent !== q.correct) {
                btn.style.opacity = '0.5';
            }
        });
        
        // Show correct feedback
        showFeedback(true, pointsGained);
    } else {
        // Incorrect Answer
        buttonEl.classList.add('selected-incorrect');
        buttonEl.disabled = true;
        
        stats.streak = 0;
        saveStats();
        updateStatsUI();
        
        eliminatedOptions.push(selectedOption);
        
        // Dynamic Distractor Replacement Mechanic!
        // We find a distractor in the pool that isn't currently displayed and wasn't eliminated yet.
        const unusedDistractors = currentDistractorPool.filter(d => 
            !currentOptions.includes(d) && !eliminatedOptions.includes(d)
        );
        
        // Show incorrect feedback temporarily
        showFeedback(false, selectedOption);
        
        if (unusedDistractors.length > 0) {
            // Replace the incorrect option with a fresh one after a small delay
            setTimeout(() => {
                if (isAnswered) return; // Guard if user somehow answered correctly in between (should not happen)
                
                // Shuffle unused distractors to select one randomly
                shuffleArray(unusedDistractors);
                const newDistractor = unusedDistractors[0];
                
                // Swap the old incorrect option with the new distractor in the active array
                const indexToReplace = currentOptions.indexOf(selectedOption);
                if (indexToReplace !== -1) {
                    currentOptions[indexToReplace] = newDistractor;
                }
                
                // Re-shuffle options so position changes!
                shuffleArray(currentOptions);
                
                // Re-render options
                renderOptionsUI();
                showToast("¡Respuestas barajadas! Se ha introducido una nueva opción.");
            }, 1400); // Give user 1.4s to see they were wrong and read the feedback hint
        }
    }
}

// Show feedback panel with explanations
function showFeedback(isCorrect, arg) {
    const q = filteredQuestions[currentQuestionIndex];
    elements.feedbackPanel.style.display = 'block';
    
    if (isCorrect) {
        elements.feedbackPanel.className = 'feedback-panel correct-feedback';
        elements.feedbackIcon.className = 'fa-solid fa-circle-check';
        elements.feedbackTitle.textContent = '¡Respuesta Correcta!';
        elements.feedbackSubtitle.textContent = `Ganaste +${arg} puntos. ¡Gran lógica de React!`;
        elements.feedbackExplanation.textContent = q.explanation;
        
        if (q.mnemonic) {
            elements.feedbackMnemonicWrapper.style.display = 'block';
            elements.feedbackMnemonic.innerHTML = `<strong>Consejo / Mnemotecnia:</strong> ${q.mnemonic}`;
        } else {
            elements.feedbackMnemonicWrapper.style.display = 'none';
        }
        
        // Show next button, hide challenge button (since they got it right)
        elements.btnNextQuestion.style.display = 'inline-flex';
        elements.btnChallengeAgain.style.display = 'inline-flex';
    } else {
        elements.feedbackPanel.className = 'feedback-panel incorrect-feedback';
        elements.feedbackIcon.className = 'fa-solid fa-circle-xmark';
        elements.feedbackTitle.textContent = '¡Incorrecto!';
        
        // Contextual Hint based on incorrect selection
        elements.feedbackSubtitle.textContent = `"${arg}" no es la respuesta correcta para este planteamiento.`;
        elements.feedbackExplanation.textContent = `Pista: El concepto está relacionado con: ${q.explanation.split('.')[0]}. Intenta encontrar la respuesta en la lista reorganizada.`;
        elements.feedbackMnemonicWrapper.style.display = 'none';
        
        // Hide next button (must answer correctly first), show challenge/reset button
        elements.btnNextQuestion.style.display = 'none';
        elements.btnChallengeAgain.style.display = 'none';
    }
    
    // Scroll feedback into view smoothly on mobile/small screens
    setTimeout(() => {
        elements.feedbackPanel.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }, 100);
}

// Challenge Again (Reshuffle distractors on current question manually)
function challengeAgain() {
    loadQuestion(currentQuestionIndex);
    showToast("Pregunta reiniciada con opciones y orden diferentes.");
}

// Advance to Next Question
function nextQuestion() {
    let nextIdx = currentQuestionIndex + 1;
    if (nextIdx >= filteredQuestions.length) {
        nextIdx = 0;
        showToast("¡Has completado todas las preguntas de este tema! Empezando de nuevo y mezclando orden.");
        filteredQuestions = shuffleArray(filteredQuestions);
    }
    loadQuestion(nextIdx);
}

// Navigation Tabs Switcher
function switchTab(tabId) {
    // Nav buttons update
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`nav-btn-${tabId}`);
    if (activeBtn) activeBtn.classList.add('active');
    
    // Tab contents update
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    const activeTab = document.getElementById(`tab-${tabId}`);
    if (activeTab) activeTab.classList.add('active');
    
    // Perform tasks on specific tab load
    if (tabId === 'guide') {
        renderGuide();
    } else if (tabId === 'custom') {
        renderCustomQuestionsList();
    }
}

// Statistics Mechanics
function loadStats() {
    const saved = localStorage.getItem('medprep_stats');
    if (saved) {
        stats = JSON.parse(saved);
    }
}

function saveStats() {
    localStorage.setItem('medprep_stats', JSON.stringify(stats));
}

function updateStatsUI() {
    elements.statStreak.textContent = stats.streak;
    elements.statSolved.textContent = stats.totalSolved;
    elements.statScore.textContent = stats.score;
    
    // Accuracy
    const accuracy = stats.attempts > 0 ? Math.round((stats.correctCount / stats.attempts) * 100) : 0;
    elements.statAccuracy.textContent = `${accuracy}%`;
    
    // Level progress
    // Assume 15 levels. Each 10 correct answers increase level.
    const questionsNeededPerLevel = 8;
    const currentProgress = stats.correctCount % questionsNeededPerLevel;
    const progressPercent = Math.round((currentProgress / questionsNeededPerLevel) * 100);
    
    elements.statLevelPercent.textContent = `${progressPercent}%`;
    elements.statLevelBar.style.width = `${progressPercent}%`;
}

function resetProgress() {
    if (confirm("¿Estás seguro de que quieres restablecer todas tus estadísticas? Tu historial se borrará.")) {
        stats = {
            streak: 0,
            totalSolved: 0,
            correctCount: 0,
            score: 0,
            attempts: 0
        };
        saveStats();
        updateStatsUI();
        showToast("Estadísticas reiniciadas.");
    }
}

// ==========================================================================
// TAB 2: LIBRARY / GUIDE FUNCTIONS
// ==========================================================================
function renderGuide() {
    const searchVal = elements.guideSearch.value.toLowerCase().trim();
    elements.guideGrid.innerHTML = '';
    
    // Filter questions based on search query
    const matched = questions.filter(q => {
        return (
            q.question.toLowerCase().includes(searchVal) ||
            q.correct.toLowerCase().includes(searchVal) ||
            q.category.toLowerCase().includes(searchVal) ||
            q.explanation.toLowerCase().includes(searchVal) ||
            (q.mnemonic && q.mnemonic.toLowerCase().includes(searchVal))
        );
    });
    
    if (matched.length === 0) {
        elements.guideGrid.innerHTML = `
            <div class="card empty-state" style="grid-column: 1 / -1;">
                <i class="fa-solid fa-triangle-exclamation"></i>
                <p>No se encontraron conceptos que coincidan con la búsqueda.</p>
            </div>
        `;
        return;
    }
    
    matched.forEach(q => {
        const card = document.createElement('div');
        card.className = 'card guide-card-item';
        
        let mnemonicHtml = '';
        if (q.mnemonic) {
            mnemonicHtml = `
                <div class="mnemonic-preview">
                    <strong>Mnemotecnia:</strong> ${q.mnemonic}
                </div>
            `;
        }
        
        card.innerHTML = `
            <span class="badge">${q.category}</span>
            <h3>${q.question}</h3>
            <div class="correct-ans-preview">
                <i class="fa-solid fa-circle-check"></i> ${q.correct}
            </div>
            <p class="explanation-preview">${q.explanation}</p>
            ${mnemonicHtml}
        `;
        elements.guideGrid.appendChild(card);
    });
}

// ==========================================================================
// TAB 3: CUSTOM EXAM CREATOR FUNCTIONS
// ==========================================================================
function handleCustomQuestionSubmit(e) {
    e.preventDefault();
    
    const category = document.getElementById('custom-category').value.trim();
    const difficulty = document.getElementById('custom-difficulty').value;
    const questionText = document.getElementById('custom-question').value.trim();
    const correctAns = document.getElementById('custom-correct').value.trim();
    const explanation = document.getElementById('custom-explanation').value.trim();
    const mnemonic = document.getElementById('custom-mnemonic').value.trim();
    
    // Collect distractors
    const distractorEls = document.querySelectorAll('.custom-distractor');
    const distractors = [];
    
    distractorEls.forEach(el => {
        const val = el.value.trim();
        if (val) {
            distractors.push(val);
        }
    });
    
    if (distractors.length < 3) {
        showToast("Ingresa al menos 3 distractores (incorrectas).", "error");
        return;
    }
    
    const newQuestion = {
        id: 'cust_' + Date.now(),
        category,
        difficulty,
        question: questionText,
        correct: correctAns,
        distractors,
        explanation,
        mnemonic: mnemonic || null
    };
    
    // Save to LocalStorage
    const customQs = JSON.parse(localStorage.getItem('medprep_custom_questions')) || [];
    customQs.push(newQuestion);
    localStorage.setItem('medprep_custom_questions', JSON.stringify(customQs));
    
    // Refresh App State
    loadQuestions();
    filterQuestions();
    renderCategories();
    renderCustomQuestionsList();
    
    // Reset Form
    elements.customForm.reset();
    showToast("¡Pregunta guardada y añadida al banco de preguntas!");
}

function renderCustomQuestionsList() {
    const customQs = JSON.parse(localStorage.getItem('medprep_custom_questions')) || [];
    elements.customQuestionsCount.textContent = customQs.length;
    elements.customQuestionsList.innerHTML = '';
    
    if (customQs.length === 0) {
        elements.customQuestionsList.innerHTML = `
            <div class="empty-state">
                <i class="fa-solid fa-folder-open"></i>
                <p>Aún no has creado preguntas personalizadas.</p>
            </div>
        `;
        return;
    }
    
    customQs.forEach(q => {
        const item = document.createElement('div');
        item.className = 'custom-question-item';
        item.innerHTML = `
            <div class="custom-q-header">
                <span class="category">${q.category}</span>
                <button class="btn-delete-q" onclick="deleteCustomQuestion('${q.id}')" title="Eliminar pregunta">
                    <i class="fa-solid fa-trash-can"></i>
                </button>
            </div>
            <p class="custom-q-text">${q.question}</p>
            <div class="custom-q-footer">
                <span>Dificultad: ${q.difficulty}</span>
                <span>${q.distractors.length + 1} opciones</span>
            </div>
        `;
        elements.customQuestionsList.appendChild(item);
    });
}

function deleteCustomQuestion(id) {
    if (confirm("¿Estás seguro de que quieres eliminar esta pregunta? Se borrará permanentemente.")) {
        let customQs = JSON.parse(localStorage.getItem('medprep_custom_questions')) || [];
        customQs = customQs.filter(q => q.id !== id);
        localStorage.setItem('medprep_custom_questions', JSON.stringify(customQs));
        
        // Refresh
        loadQuestions();
        filterQuestions();
        renderCategories();
        renderCustomQuestionsList();
        showToast("Pregunta eliminada con éxito.");
        
        // If we deleted the active question, reload
        if (filteredQuestions.length > 0) {
            loadQuestion(0);
        }
    }
}

// Backup Questions (Export to JSON)
function exportCustomQuestions() {
    const customQs = JSON.parse(localStorage.getItem('medprep_custom_questions')) || [];
    if (customQs.length === 0) {
        showToast("No hay preguntas personalizadas para exportar.");
        return;
    }
    
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(customQs, null, 4));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `medprep_custom_questions_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast("Preguntas exportadas en archivo JSON.");
}

// Import Questions (From JSON)
function importCustomQuestions(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            
            // Basic validation
            if (!Array.isArray(imported)) {
                throw new Error("El archivo JSON debe contener un arreglo de preguntas.");
            }
            
            // Validate first element format roughly
            if (imported.length > 0) {
                const item = imported[0];
                if (!item.question || !item.correct || !item.distractors) {
                    throw new Error("El formato de las preguntas importadas no es válido.");
                }
            }
            
            // Load and merge
            const currentCustom = JSON.parse(localStorage.getItem('medprep_custom_questions')) || [];
            
            // Add unique IDs if missing or duplicate
            const validatedImported = imported.map(q => {
                return {
                    ...q,
                    id: q.id && !currentCustom.some(cq => cq.id === q.id) ? q.id : 'cust_' + Math.random().toString(36).substr(2, 9)
                };
            });
            
            const newCustom = [...currentCustom, ...validatedImported];
            localStorage.setItem('medprep_custom_questions', JSON.stringify(newCustom));
            
            // Refresh
            loadQuestions();
            filterQuestions();
            renderCategories();
            renderCustomQuestionsList();
            showToast(`¡Se importaron ${validatedImported.length} preguntas con éxito!`);
            
            // Clear file input
            elements.importFileInput.value = '';
        } catch (error) {
            alert("Error al importar: " + error.message);
        }
    };
    reader.readAsText(file);
}

// ==========================================================================
// HELPER UTILITIES
// ==========================================================================

// Shuffle array elements randomly (Fisher-Yates)
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// Show floating notification Toast
function showToast(message, type = "success") {
    elements.toastMessage.textContent = message;
    
    if (type === "error") {
        elements.toast.style.borderColor = "var(--color-incorrect)";
    } else {
        elements.toast.style.borderColor = "var(--color-primary)";
    }
    
    elements.toast.classList.add('show');
    
    // Clear previous timeout if any
    if (window.toastTimeout) {
        clearTimeout(window.toastTimeout);
    }
    
    window.toastTimeout = setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// Theme toggler (Light/Dark Mode)
function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('medprep_theme', newTheme);
    
    // Toggle Icon
    if (newTheme === 'light') {
        elements.themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        elements.themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
}

function loadTheme() {
    const savedTheme = localStorage.getItem('medprep_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    
    if (savedTheme === 'light') {
        elements.themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i>';
    } else {
        elements.themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i>';
    }
}
