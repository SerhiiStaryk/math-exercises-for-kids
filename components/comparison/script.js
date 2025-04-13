// Використовуємо змінні з common.js
function selectComparisonGame() {
    currentGame = 'comparison';
    document.getElementById('game-selection').classList.add('hidden');
    document.getElementById('comparison-game').classList.remove('hidden');
    startComparisonGame();
}

function startComparisonGame() {
    currentQuestion = 0;
    correctAnswers = 0;
    lastSubmittedAnswer = null; // Скидаємо останню відповідь
    generateComparisonQuestion();
    updateProgress('comparison-progress-fill', 'comparison-progress-text');
}

function generateComparisonQuestion() {
    currentA = Math.floor(Math.random() * 10) + 1;
    currentB = Math.floor(Math.random() * 10) + 1;
    
    if (currentA > currentB) {
        currentAnswer = '>';
    } else if (currentA < currentB) {
        currentAnswer = '<';
    } else {
        currentAnswer = '=';
    }
    
    document.getElementById('comparison-question').textContent = `${currentA} ? ${currentB}`;
    lastSubmittedAnswer = null; // Скидаємо останню відповідь при генерації нового питання
}

function checkComparisonAnswer(button) {
    const userAnswer = button.getAttribute('data-value');
    const resultMessage = document.getElementById('comparison-result-message');
    const checkButton = document.getElementById('check-comparison-button');
    
    // Перевіряємо на дублювання відповіді
    if (isDuplicateAnswer(userAnswer)) {
        return;
    }
    
    // Блокуємо всі кнопки
    setButtonsEnabled(false, 'comparison-game');
    checkButton.disabled = true;
    
    if (userAnswer === currentAnswer) {
        button.classList.add('correct');
        resultMessage.textContent = '✅ Правильно! Молодець!';
        resultMessage.className = 'correct';
        correctAnswers++;
    } else {
        button.classList.add('incorrect');
        // Показуємо правильну відповідь
        const buttons = document.querySelectorAll('#comparison-game .answer-button');
        buttons.forEach(btn => {
            if (btn.getAttribute('data-value') === currentAnswer) {
                btn.classList.add('correct');
            }
        });
        resultMessage.textContent = `❌ Неправильно. Правильна відповідь: ${currentA} ${currentAnswer} ${currentB}`;
        resultMessage.className = 'incorrect';
        
        if (!isReviewMode) {
            saveMistake('comparison', {
                a: currentA,
                b: currentB,
                operation: 'comparison',
                correctAnswer: currentAnswer,
                userAnswer: userAnswer
            });
        }
    }
    
    currentQuestion++;
    updateProgress('comparison-progress-fill', 'comparison-progress-text');
    
    if (currentQuestion < totalQuestions && (!isReviewMode || currentMistakes.length > 0)) {
        setTimeout(() => {
            resultMessage.textContent = '';
            // Розблоковуємо кнопки перед наступним питанням
            setButtonsEnabled(true, 'comparison-game');
            checkButton.disabled = false;
            generateComparisonQuestion();
        }, 1500);
    } else {
        setTimeout(() => {
            showFinalResults();
            isReviewMode = false;
        }, 1500);
    }
} 