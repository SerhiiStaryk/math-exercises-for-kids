// Використовуємо змінні з common.js
function selectSubtractionGame() {
    currentGame = 'subtraction';
    document.getElementById('game-selection').classList.add('hidden');
    document.getElementById('subtraction-game').classList.remove('hidden');
    startSubtractionGame();
}

function startSubtractionGame() {
    currentQuestion = 0;
    correctAnswers = 0;
    generateSubtractionQuestion();
    updateProgress('subtraction-progress-fill', 'subtraction-progress-text');
}

function generateSubtractionQuestion() {
    // Generate numbers for subtraction (result should not be negative)
    currentA = Math.floor(Math.random() * 10) + 1; // Number from 1 to 10
    currentB = Math.floor(Math.random() * currentA); // Number from 0 to currentA
    currentAnswer = currentA - currentB;

    // Display the question
    document.getElementById('subtraction-question').textContent = `${currentA} - ${currentB} = ?`;

    // Generate answer options
    const answers = generateSubtractionAnswerOptions(currentAnswer);
    const answerButtons = document.querySelectorAll('#subtraction-game .answer-button');
    
    // Shuffle and assign answers to buttons
    answers.forEach((answer, index) => {
        answerButtons[index].textContent = answer;
        answerButtons[index].setAttribute('data-value', answer);
        answerButtons[index].className = 'answer-button'; // Reset button styles
        answerButtons[index].disabled = false; // Enable buttons
    });
}

function generateSubtractionAnswerOptions(correctAnswer) {
    let answers = [correctAnswer];
    
    // Generate two wrong answers that make sense for subtraction
    while (answers.length < 3) {
        // Generate a number between 0 and 10, but not equal to the correct answer
        let wrongAnswer = Math.floor(Math.random() * 11);
        if (!answers.includes(wrongAnswer) && wrongAnswer !== correctAnswer) {
            answers.push(wrongAnswer);
        }
    }
    
    // Shuffle answers
    return answers.sort(() => Math.random() - 0.5);
}

function checkSubtractionAnswer(button) {
    const userAnswer = parseInt(button.getAttribute('data-value'));
    const resultMessage = document.getElementById('subtraction-result-message');
    const buttons = document.querySelectorAll('#subtraction-game .answer-button');
    
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
            saveMistake('subtraction', {
                a: currentA,
                b: currentB,
                operation: 'subtraction',
                correctAnswer: currentAnswer,
                userAnswer: userAnswer
            });
        }
    }
    
    currentQuestion++;
    updateProgress('subtraction-progress-fill', 'subtraction-progress-text');
    
    if (currentQuestion < totalQuestions && (!isReviewMode || currentMistakes.length > 0)) {
        setTimeout(() => {
            resultMessage.textContent = '';
            buttons.forEach(btn => btn.disabled = false);
            generateSubtractionQuestion();
        }, 1500);
    } else {
        setTimeout(() => {
            showFinalResults();
            isReviewMode = false;
        }, 1500);
    }
} 