// Використовуємо змінні з common.js
function selectMultiplicationGame() {
    currentGame = 'multiplication';
    document.getElementById('game-selection').classList.add('hidden');
    document.getElementById('multiplication-game').classList.remove('hidden');
}

function startMultiplicationGame(level) {
    maxNumber = getMaxNumber(level);
    currentQuestion = 0;
    correctAnswers = 0;
    currentGame = 'multiplication';
    lastSubmittedAnswer = null; // Скидаємо останню відповідь
    
    document.getElementById('level-selection').classList.add('hidden');
    document.getElementById('multiplication-game-play').classList.remove('hidden');
    document.getElementById('final-results').classList.add('hidden');
    updateProgress('progress-fill', 'progress-text');
    generateMultiplicationQuestion();
}

function generateMultiplicationQuestion() {
    if (isReviewMode && currentMistakes.length > 0) {
        const mistake = currentMistakes[0];
        currentA = mistake.a;
        currentB = mistake.b;
        currentAnswer = mistake.correctAnswer;
    } else {
        currentA = Math.floor(Math.random() * maxNumber) + 1;
        currentB = Math.floor(Math.random() * maxNumber) + 1;
        currentAnswer = currentA * currentB;
    }
    document.getElementById('multiplication-question-text').textContent = `Скільки буде ${currentA} × ${currentB}?`;
    document.getElementById('multiplication-answer-input').value = '';
    document.getElementById('multiplication-answer-input').focus();
    lastSubmittedAnswer = null; // Скидаємо останню відповідь при генерації нового питання
}

function checkMultiplicationAnswer() {
    const userAnswer = parseInt(document.getElementById('multiplication-answer-input').value);
    const resultMessage = document.getElementById('multiplication-result-message');
    
    if (isNaN(userAnswer)) {
        resultMessage.textContent = 'Будь ласка, введіть число';
        resultMessage.className = 'incorrect';
        return;
    }
    
    // Перевіряємо на дублювання відповіді
    if (isDuplicateAnswer(userAnswer)) {
        return;
    }
    
    if (userAnswer === currentAnswer) {
        resultMessage.textContent = '✅ Правильно! Молодець!';
        resultMessage.className = 'correct';
        correctAnswers++;
    } else {
        resultMessage.textContent = `❌ Неправильно. Правильна відповідь: ${currentAnswer}`;
        resultMessage.className = 'incorrect';
        
        if (!isReviewMode) {
            saveMistake('multiplication', {
                a: currentA,
                b: currentB,
                operation: 'multiplication',
                correctAnswer: currentAnswer,
                userAnswer: userAnswer
            });
        }
    }
    
    currentQuestion++;
    updateProgress('progress-fill', 'progress-text');
    
    if (currentQuestion < totalQuestions && (!isReviewMode || currentMistakes.length > 0)) {
        setTimeout(generateMultiplicationQuestion, 1500);
    } else {
        setTimeout(() => {
            showFinalResults();
            isReviewMode = false;
        }, 1500);
    }
}

// Додаємо обробник події для клавіші Enter
document.getElementById('multiplication-answer-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkMultiplicationAnswer();
    }
}); 