let currentQuestion = 0;
let correctAnswers = 0;
let maxNumber = 4;
let totalQuestions = 10;
let currentA = 0;
let currentB = 0;
let currentAnswer = 0;
let currentGame = '';
let currentAdditionNumber = 1;
let currentRocket = null;
let isReviewMode = false;
let currentMistakes = [];
let currentGameType = '';
let currentLevel = 1;
let score = 0;
let mistakes = [];

function selectGame(game) {
    currentGame = game;
    document.getElementById('game-selection').classList.add('hidden');
    if (game === 'multiplication') {
        document.getElementById('multiplication-game').classList.remove('hidden');
    } else if (game === 'division') {
        document.getElementById('division-game').classList.remove('hidden');
    } else if (game === 'addition') {
        document.getElementById('addition-game').classList.remove('hidden');
        startAdditionGame();
    } else if (game === 'subtraction') {
        document.getElementById('subtraction-game').classList.remove('hidden');
        startSubtractionGame();
    } else if (game === 'comparison') {
        document.getElementById('comparison-game').classList.remove('hidden');
        startComparisonGame();
    }
}

function getMaxNumber(level) {
    switch(level) {
        case 1: return 4;  // Легкий: 1-4
        case 2: return 7;  // Середній: 1-7
        case 3: return 10; // Складний: 1-10
        default: return 4;
    }
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
    document.getElementById('question-text').textContent = `Скільки буде ${currentA} × ${currentB}?`;
    document.getElementById('answer-input').value = '';
    document.getElementById('answer-input').focus();
}

function generateDivisionQuestion() {
    currentB = Math.floor(Math.random() * maxNumber) + 1;
    currentAnswer = Math.floor(Math.random() * maxNumber) + 1;
    currentA = currentB * currentAnswer;
    document.getElementById('division-question-text').textContent = `Скільки буде ${currentA} ÷ ${currentB}?`;
    document.getElementById('division-answer-input').value = '';
    document.getElementById('division-answer-input').focus();
}

function startGame(level, game) {
    maxNumber = getMaxNumber(level);
    currentQuestion = 0;
    correctAnswers = 0;
    currentGame = game;
    
    if (game === 'multiplication') {
        document.getElementById('level-selection').classList.add('hidden');
        document.getElementById('game').classList.remove('hidden');
        document.getElementById('final-results').classList.add('hidden');
        updateProgress();
        generateMultiplicationQuestion();
    } else if (game === 'division') {
        document.getElementById('division-level-selection').classList.add('hidden');
        document.getElementById('division-game-play').classList.remove('hidden');
        document.getElementById('final-results').classList.add('hidden');
        updateDivisionProgress();
        generateDivisionQuestion();
    } else if (game === 'addition') {
        document.getElementById('addition-game').classList.remove('hidden');
        startAdditionGame();
    } else if (game === 'subtraction') {
        document.getElementById('subtraction-game').classList.remove('hidden');
        startSubtractionGame();
    } else if (game === 'comparison') {
        document.getElementById('comparison-game').classList.remove('hidden');
        startComparisonGame();
    }
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim();
    let isCorrect = false;
    
    if (currentGameType === 'comparison') {
        isCorrect = userAnswer === currentExercise.answer;
        if (isCorrect) {
            showModal(`Правильно! ${currentExercise.num1} ${currentExercise.answer} ${currentExercise.num2}`);
        } else {
            showModal(`Неправильно. Правильна відповідь: ${currentExercise.num1} ${currentExercise.answer} ${currentExercise.num2}`);
        }
    } else {
        isCorrect = userAnswer === currentExercise.answer.toString();
        if (isCorrect) {
            showModal('Правильно! Молодець!');
        } else {
            showModal('Неправильно. Спробуйте ще раз!');
        }
    }
    
    if (isCorrect) {
        score += 10;
        document.getElementById('score').textContent = score;
        if (score % 50 === 0) {
            currentLevel++;
            document.getElementById('level').textContent = currentLevel;
        }
        document.getElementById('answer').value = '';
        if (currentGameType === 'comparison') {
            currentExercise = generateComparisonExercise();
            document.getElementById('question').textContent = currentExercise.question;
        } else {
            currentExercise = generateExercise(currentGameType);
            document.getElementById('question').textContent = currentExercise.question;
        }
    } else {
        const mistake = {
            question: currentExercise.question,
            userAnswer: userAnswer,
            correctAnswer: currentGameType === 'comparison' ? 
                `${currentExercise.num1} ${currentExercise.answer} ${currentExercise.num2}` : 
                currentExercise.answer
        };
        mistakes.push(mistake);
        saveMistakes();
        updateMistakesList();
    }
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
    }
    
    currentQuestion++;
    updateDivisionProgress();
    
    if (currentQuestion < totalQuestions) {
        setTimeout(generateDivisionQuestion, 1500);
    } else {
        setTimeout(showFinalResults, 1500);
    }
}

function updateProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.getElementById('progress-fill').style.width = `${progress}%`;
    document.getElementById('progress-text').textContent = `${currentQuestion}/${totalQuestions}`;
}

function updateDivisionProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.getElementById('division-progress-fill').style.width = `${progress}%`;
    document.getElementById('division-progress-text').textContent = `${currentQuestion}/${totalQuestions}`;
}

function startAdditionGame() {
    currentQuestion = 0;
    correctAnswers = 0;
    generateAdditionQuestion();
    updateAdditionProgress();
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
    const answerButtons = document.querySelectorAll('.answer-button');
    
    // Shuffle and assign answers to buttons
    answers.forEach((answer, index) => {
        answerButtons[index].textContent = answer;
        answerButtons[index].setAttribute('data-value', answer);
        answerButtons[index].className = 'answer-button'; // Reset button styles
    });
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
    const buttons = document.querySelectorAll('.answer-button');
    
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
    }
    
    currentQuestion++;
    updateAdditionProgress();
    
    if (currentQuestion < totalQuestions) {
        setTimeout(() => {
            resultMessage.textContent = '';
            buttons.forEach(btn => btn.disabled = false);
            generateAdditionQuestion();
        }, 1500);
    } else {
        setTimeout(showFinalResults, 1500);
    }
}

function updateAdditionProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.getElementById('addition-progress-fill').style.width = `${progress}%`;
    document.getElementById('addition-progress-text').textContent = `${currentQuestion}/${totalQuestions}`;
}

function startSubtractionGame() {
    currentQuestion = 0;
    correctAnswers = 0;
    generateSubtractionQuestion();
    updateSubtractionProgress();
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
    }
    
    currentQuestion++;
    updateSubtractionProgress();
    
    if (currentQuestion < totalQuestions) {
        setTimeout(() => {
            resultMessage.textContent = '';
            generateSubtractionQuestion();
        }, 1500);
    } else {
        setTimeout(showFinalResults, 1500);
    }
}

function updateSubtractionProgress() {
    const progress = (currentQuestion / totalQuestions) * 100;
    document.getElementById('subtraction-progress-fill').style.width = `${progress}%`;
    document.getElementById('subtraction-progress-text').textContent = `${currentQuestion}/${totalQuestions}`;
}

function showFinalResults() {
    if (currentGame === 'multiplication') {
        document.getElementById('game').classList.add('hidden');
    } else if (currentGame === 'division') {
        document.getElementById('division-game-play').classList.add('hidden');
    } else if (currentGame === 'addition') {
        document.getElementById('addition-game').classList.add('hidden');
    } else if (currentGame === 'subtraction') {
        document.getElementById('subtraction-game').classList.add('hidden');
    } else if (currentGame === 'comparison') {
        document.getElementById('comparison-game').classList.add('hidden');
    }
    
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

function restartGame() {
    document.getElementById('final-results').classList.add('hidden');
    if (currentGame === 'multiplication') {
        document.getElementById('level-selection').classList.remove('hidden');
    } else if (currentGame === 'division') {
        document.getElementById('division-level-selection').classList.remove('hidden');
    } else if (currentGame === 'addition') {
        document.getElementById('addition-game').classList.remove('hidden');
        startAdditionGame();
    } else if (currentGame === 'subtraction') {
        document.getElementById('subtraction-game').classList.remove('hidden');
        startSubtractionGame();
    } else if (currentGame === 'comparison') {
        document.getElementById('comparison-game').classList.remove('hidden');
        startComparisonGame();
    }
}

function returnToMenu() {
    isReviewMode = false;
    currentMistakes = [];
    document.getElementById('game-selection').classList.remove('hidden');
    document.getElementById('multiplication-game').classList.add('hidden');
    document.getElementById('division-game').classList.add('hidden');
    document.getElementById('addition-game').classList.add('hidden');
    document.getElementById('subtraction-game').classList.add('hidden');
    document.getElementById('comparison-game').classList.add('hidden');
    document.getElementById('statistics').classList.add('hidden');
    document.getElementById('final-results').classList.add('hidden');
}

// Додаємо обробники подій для клавіші Enter
document.getElementById('answer-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

document.getElementById('division-answer-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkDivisionAnswer();
    }
});

// Function to save mistake to localStorage
function saveMistake(gameType, mistake) {
    let mistakes = JSON.parse(localStorage.getItem(`${gameType}_mistakes`) || '[]');
    mistakes.push(mistake);
    localStorage.setItem(`${gameType}_mistakes`, JSON.stringify(mistakes));
}

// Function to remove mistake from localStorage
function removeMistake(gameType, mistake) {
    let mistakes = JSON.parse(localStorage.getItem(`${gameType}_mistakes`) || '[]');
    mistakes = mistakes.filter(m => 
        !(m.a === mistake.a && m.b === mistake.b && m.operation === mistake.operation)
    );
    localStorage.setItem(`${gameType}_mistakes`, JSON.stringify(mistakes));
}

// Function to show statistics page
function showStatistics() {
    document.getElementById('game-selection').classList.add('hidden');
    document.getElementById('statistics').classList.remove('hidden');
    
    // Update statistics for each game type
    updateMistakesList('multiplication');
    updateMistakesList('division');
    updateMistakesList('addition');
    updateMistakesList('subtraction');
    updateMistakesList('comparison');
}

// Function to update mistakes list in statistics
function updateMistakesList(gameType) {
    const mistakes = JSON.parse(localStorage.getItem(`${gameType}_mistakes`) || '[]');
    const container = document.getElementById(`${gameType}-mistakes`);
    container.innerHTML = '';
    
    if (mistakes.length === 0) {
        container.innerHTML = '<p>Немає помилок</p>';
        return;
    }
    
    mistakes.forEach(mistake => {
        const div = document.createElement('div');
        div.className = 'mistake-item';
        let operationSymbol = '';
        switch(mistake.operation) {
            case 'multiplication': operationSymbol = '×'; break;
            case 'division': operationSymbol = '÷'; break;
            case 'addition': operationSymbol = '+'; break;
            case 'subtraction': operationSymbol = '-'; break;
        }
        div.textContent = `${mistake.a} ${operationSymbol} ${mistake.b} = ${mistake.correctAnswer} (ваша відповідь: ${mistake.userAnswer})`;
        container.appendChild(div);
    });
}

// Function to start mistake review mode
function startMistakeReview(gameType) {
    const mistakes = JSON.parse(localStorage.getItem(`${gameType}_mistakes`) || '[]');
    if (mistakes.length === 0) {
        alert('Немає помилок для повторення!');
        return;
    }
    
    isReviewMode = true;
    currentMistakes = [...mistakes];
    currentGame = gameType;
    
    // Start appropriate game with mistakes
    switch(gameType) {
        case 'multiplication':
        case 'division':
            startGame(1, gameType); // Start with level 1, will be ignored in review mode
            break;
        case 'addition':
            document.getElementById('addition-game').classList.remove('hidden');
            startAdditionGame();
            break;
        case 'subtraction':
            document.getElementById('subtraction-game').classList.remove('hidden');
            startSubtractionGame();
            break;
        case 'comparison':
            document.getElementById('comparison-game').classList.remove('hidden');
            startComparisonGame();
            break;
    }
}

function showModal(message) {
    document.getElementById('modal-message').textContent = message;
    document.getElementById('modal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

function checkAnswer() {
    const userAnswer = document.getElementById('answer').value.trim().toLowerCase();
    const correctAnswer = currentWord.translation.toLowerCase();

    if (userAnswer === correctAnswer) {
        showModal('Правильно! Молодець!');
        document.getElementById(currentWord.id).classList.add('corrected');
        document.getElementById('answer').value = '';
        loadNextWord();
    } else {
        showModal('Неправильно. Спробуйте ще раз!');
    }
}

function generateComparisonExercise() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    
    return {
        num1: num1,
        num2: num2,
        question: `${num1} ? ${num2}`,
        answer: num1 > num2 ? '>' : (num1 < num2 ? '<' : '=')
    };
}

function startComparisonGame() {
    currentGame = 'comparison';
    document.getElementById('game-selection').classList.add('hidden');
    document.getElementById('comparison-game').classList.remove('hidden');
    currentQuestion = 0;
    correctAnswers = 0;
    updateComparisonProgress();
    generateComparisonQuestion();
}

function generateComparisonQuestion() {
    const exercise = generateComparisonExercise();
    currentAnswer = exercise.answer;
    document.getElementById('comparison-question').textContent = exercise.question;
    document.getElementById('comparison-result-message').textContent = '';
}

function checkComparisonAnswer(button) {
    const userAnswer = button.getAttribute('data-value');
    const resultMessage = document.getElementById('comparison-result-message');
    
    if (userAnswer === currentAnswer) {
        resultMessage.textContent = '✅ Правильно! Молодець!';
        resultMessage.className = 'correct';
        correctAnswers++;
    } else {
        resultMessage.textContent = `❌ Неправильно. Правильна відповідь: ${currentAnswer}`;
        resultMessage.className = 'incorrect';
        
        if (!isReviewMode) {
            saveMistake('comparison', {
                num1: parseInt(currentAnswer.split(' ')[0]),
                num2: parseInt(currentAnswer.split(' ')[2]),
                operation: 'comparison',
                correctAnswer: currentAnswer,
                userAnswer: userAnswer
            });
        }
    }
    
    currentQuestion++;
    updateComparisonProgress();
    
    if (currentQuestion < totalQuestions && (!isReviewMode || currentMistakes.length > 0)) {
        setTimeout(generateComparisonQuestion, 1500);
    } else {
        setTimeout(() => {
            showFinalResults();
            isReviewMode = false;
        }, 1500);
    }
}

function updateComparisonProgress() {
    const progressText = document.getElementById('comparison-progress-text');
    const progressFill = document.getElementById('comparison-progress-fill');
    
    progressText.textContent = `${currentQuestion}/${totalQuestions}`;
    const progressPercentage = (currentQuestion / totalQuestions) * 100;
    progressFill.style.width = `${progressPercentage}%`;
} 