// Загальні змінні для всіх ігор
let currentA = 0;
let currentB = 0;
let currentAnswer = 0;
let currentQuestion = 0;
let correctAnswers = 0;
let totalQuestions = 10;
let currentGame = '';
let isReviewMode = false;
let currentMistakes = [];
let maxNumber = 10;
let currentLevel = 1;
let lastSubmittedAnswer = null; // Додаємо змінну для відстеження останньої відповіді

// Загальні функції
function getMaxNumber(level) {
    switch(level) {
        case 1: return 4;  // Легкий: 1-4
        case 2: return 7;  // Середній: 1-7
        case 3: return 10; // Складний: 1-10
        default: return 4;
    }
}

function updateProgress(progressFillId, progressTextId) {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.getElementById(progressFillId).style.width = `${progress}%`;
    document.getElementById(progressTextId).textContent = `${currentQuestion}/${totalQuestions}`;
}

function showFinalResults() {
    document.getElementById('final-results').classList.remove('hidden');
    
    const score = (correctAnswers / totalQuestions) * 100;
    document.getElementById('final-score').textContent = 
        `Твій результат: ${correctAnswers} з ${totalQuestions} правильних відповідей (${score.toFixed(1)}%)`;
    
    let finalMessage = '';
    if (score === 100) {
        finalMessage = 'Відмінно! Ти справжній чемпіон! 🏆';
    } else if (score >= 70) {
        finalMessage = 'Добре! Продовжуй тренуватися! 👍';
    } else {
        finalMessage = 'Не засмучуйся! Практика робить майстра. Спробуй ще раз! 💪';
    }
    document.getElementById('final-message').textContent = finalMessage;
}

function returnToMenu() {
    // Приховуємо всі ігрові секції
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Показуємо меню вибору гри
    document.getElementById('game-selection').classList.remove('hidden');
    
    // Скидаємо стан гри
    currentGame = '';
    currentQuestion = 0;
    correctAnswers = 0;
    isReviewMode = false;
    currentMistakes = [];
    lastSubmittedAnswer = null; // Скидаємо останню відповідь
}

function saveMistake(gameType, mistake) {
    let mistakes = JSON.parse(localStorage.getItem(`${gameType}_mistakes`) || '[]');
    mistakes.push(mistake);
    localStorage.setItem(`${gameType}_mistakes`, JSON.stringify(mistakes));
}

function setButtonsEnabled(enabled, gameId) {
    const buttons = document.querySelectorAll(`#${gameId} .answer-button`);
    buttons.forEach(btn => btn.disabled = !enabled);
}

function showModal(message) {
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

// Нова функція для перевірки дублювання відповіді
function isDuplicateAnswer(answer) {
    if (lastSubmittedAnswer === answer) {
        showModal('Ви вже давали таку саму відповідь на це питання. Спробуйте іншу відповідь!');
        return true;
    }
    lastSubmittedAnswer = answer;
    return false;
}

function startMistakeReview(gameType) {
    isReviewMode = true;
    currentMistakes = JSON.parse(localStorage.getItem(`${gameType}_mistakes`) || '[]');
    
    if (currentMistakes.length === 0) {
        showModal('У вас немає помилок для перегляду.');
        return;
    }
    
    // Скидаємо лічильники
    currentQuestion = 0;
    correctAnswers = 0;
    lastSubmittedAnswer = null; // Скидаємо останню відповідь
    
    // Запускаємо гру в режимі перегляду помилок
    switch(gameType) {
        case 'multiplication':
            startMultiplicationGame(currentLevel);
            break;
        case 'division':
            startDivisionGame(currentLevel);
            break;
        case 'addition':
            startAdditionGame();
            break;
        case 'subtraction':
            startSubtractionGame();
            break;
        case 'comparison':
            startComparisonGame();
            break;
    }
}

function showStatistics() {
    const statisticsSection = document.getElementById('statistics');
    
    // Якщо статистика вже відображається, ховаємо її
    if (!statisticsSection.classList.contains('hidden')) {
        statisticsSection.classList.add('hidden');
        return;
    }
    
    // Приховуємо всі ігрові секції
    document.querySelectorAll('.game-section').forEach(section => {
        section.classList.add('hidden');
    });
    
    // Показуємо секцію статистики
    statisticsSection.classList.remove('hidden');
    
    // Оновлюємо статистику для кожної гри
    updateMistakesDisplay('multiplication');
    updateMistakesDisplay('division');
    updateMistakesDisplay('addition');
    updateMistakesDisplay('subtraction');
    updateMistakesDisplay('comparison');
}

function updateMistakesDisplay(gameType) {
    const mistakes = JSON.parse(localStorage.getItem(`${gameType}_mistakes`) || '[]');
    const container = document.getElementById(`${gameType}-mistakes`);
    container.innerHTML = '';
    
    if (mistakes.length === 0) {
        container.innerHTML = '<p>Немає помилок</p>';
        return;
    }
    
    const uniqueMistakes = {};
    mistakes.forEach(mistake => {
        const key = `${mistake.a}${mistake.operation}${mistake.b}`;
        if (!uniqueMistakes[key]) {
            uniqueMistakes[key] = {
                count: 0,
                correctAnswer: mistake.correctAnswer,
                userAnswers: []
            };
        }
        uniqueMistakes[key].count++;
        uniqueMistakes[key].userAnswers.push(mistake.userAnswer);
    });
    
    Object.entries(uniqueMistakes).forEach(([key, data]) => {
        const div = document.createElement('div');
        div.className = 'mistake-item';
        div.innerHTML = `
            <p>${key} = ${data.correctAnswer}</p>
            <p>Помилок: ${data.count}</p>
            <p>Ваші відповіді: ${data.userAnswers.join(', ')}</p>
        `;
        container.appendChild(div);
    });
} 