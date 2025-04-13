// Використовуємо змінні з common.js
function selectAdditionGame() {
    currentGame = 'addition';
    document.getElementById('game-selection').classList.add('hidden');
    document.getElementById('addition-game').classList.remove('hidden');
    startAdditionGame();
}

function startAdditionGame() {
    currentQuestion = 0;
    correctAnswers = 0;
    lastSubmittedAnswer = null; // Скидаємо останню відповідь
    generateAdditionQuestion();
    updateProgress('addition-progress-fill', 'addition-progress-text');
}

function generateAdditionQuestion() {
    // Generate numbers for addition (sum should not exceed 10)
    currentA = Math.floor(Math.random() * 10);
    currentB = Math.floor(Math.random() * (11 - currentA));
    currentAnswer = currentA + currentB;

    // Display the question
    document.getElementById('addition-question').textContent = `${currentA} + ${currentB} = ?`;

    // Generate answer options
    const answers = generateAnswerOptions(currentAnswer);
    const answerButtons = document.querySelectorAll('#addition-game .answer-button');
    
    // Shuffle and assign answers to buttons
    answers.forEach((answer, index) => {
        answerButtons[index].textContent = answer;
        answerButtons[index].setAttribute('data-value', answer);
        answerButtons[index].className = 'answer-button'; // Reset button styles
        answerButtons[index].disabled = false; // Enable buttons
    });
    
    lastSubmittedAnswer = null; // Скидаємо останню відповідь при генерації нового питання
}

function generateAnswerOptions(correctAnswer) {
    let answers = [correctAnswer];
    
    // Generate two wrong answers
    while (answers.length < 3) {
        let wrongAnswer = Math.floor(Math.random() * 11); // Random number 0-10
        if (!answers.includes(wrongAnswer) && wrongAnswer !== correctAnswer) {
            answers.push(wrongAnswer);
        }
    }
    
    // Shuffle answers
    return answers.sort(() => Math.random() - 0.5);
}

function checkAdditionAnswer(button) {
    const userAnswer = parseInt(button.getAttribute('data-value'));
    const resultMessage = document.getElementById('addition-result-message');
    const buttons = document.querySelectorAll('#addition-game .answer-button');
    
    // Перевіряємо на дублювання відповіді
    if (isDuplicateAnswer(userAnswer)) {
        return;
    }
    
    // Disable all buttons temporarily
    buttons.forEach(btn => btn.disabled = true);
    
    if (userAnswer === currentAnswer) {
        button.classList.add('correct');
        resultMessage.textContent = '✅ Правильно! Молодець!';
        resultMessage.className = 'correct';
        correctAnswers++;
    } else {
        button.classList.add('incorrect');
        // Show correct answer
        buttons.forEach(btn => {
            if (parseInt(btn.getAttribute('data-value')) === currentAnswer) {
                btn.classList.add('correct');
            }
        });
        resultMessage.textContent = '❌ Неправильно. Спробуй ще раз!';
        resultMessage.className = 'incorrect';
        
        if (!isReviewMode) {
            saveMistake('addition', {
                a: currentA,
                b: currentB,
                operation: 'addition',
                correctAnswer: currentAnswer,
                userAnswer: userAnswer
            });
        }
    }
    
    currentQuestion++;
    updateProgress('addition-progress-fill', 'addition-progress-text');
    
    if (currentQuestion < totalQuestions && (!isReviewMode || currentMistakes.length > 0)) {
        setTimeout(() => {
            resultMessage.textContent = '';
            buttons.forEach(btn => btn.disabled = false);
            generateAdditionQuestion();
        }, 1500);
    } else {
        setTimeout(() => {
            showFinalResults();
            isReviewMode = false;
        }, 1500);
    }
} 