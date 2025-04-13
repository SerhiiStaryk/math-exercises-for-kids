// Використовуємо змінні з common.js
function selectDivisionGame() {
    currentGame = 'division';
    document.getElementById('game-selection').classList.add('hidden');
    document.getElementById('division-game').classList.remove('hidden');
    document.getElementById('division-level-selection').classList.remove('hidden');
    document.getElementById('division-game-play').classList.add('hidden');
}

function startDivisionGame(level) {
    maxNumber = getMaxNumber(level);
    currentQuestion = 0;
    correctAnswers = 0;
    currentGame = 'division';
    
    document.getElementById('division-level-selection').classList.add('hidden');
    document.getElementById('division-game-play').classList.remove('hidden');
    document.getElementById('final-results').classList.add('hidden');
    updateProgress('division-progress-fill', 'division-progress-text');
    generateDivisionQuestion();
}

function generateDivisionQuestion() {
    currentB = Math.floor(Math.random() * maxNumber) + 1;
    currentAnswer = Math.floor(Math.random() * maxNumber) + 1;
    currentA = currentB * currentAnswer;
    document.getElementById('division-question-text').textContent = `Скільки буде ${currentA} ÷ ${currentB}?`;
    document.getElementById('division-answer-input').value = '';
    document.getElementById('division-answer-input').focus();
}

function checkDivisionAnswer() {
    const userAnswer = parseInt(document.getElementById('division-answer-input').value);
    const resultMessage = document.getElementById('division-result-message');
    
    if (isNaN(userAnswer)) {
        resultMessage.textContent = 'Будь ласка, введіть число';
        resultMessage.className = 'incorrect';
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
            saveMistake('division', {
                a: currentA,
                b: currentB,
                operation: 'division',
                correctAnswer: currentAnswer,
                userAnswer: userAnswer
            });
        }
    }
    
    currentQuestion++;
    updateProgress('division-progress-fill', 'division-progress-text');
    
    if (currentQuestion < totalQuestions && (!isReviewMode || currentMistakes.length > 0)) {
        setTimeout(generateDivisionQuestion, 1500);
    } else {
        setTimeout(() => {
            showFinalResults();
            isReviewMode = false;
        }, 1500);
    }
}

// Додаємо обробник події для клавіші Enter
document.getElementById('division-answer-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkDivisionAnswer();
    }
}); 