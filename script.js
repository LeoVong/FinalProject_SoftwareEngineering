// Difficulty-specific word lists
const wordLists = {
    easy: [
        "cat", "dog", "sun", "moon", "star", "tree", "fish", "bird", "car", "bus",
        "pen", "book", "hat", "ball", "cake", "milk", "egg", "cup", "key", "door",
        "box", "toy", "bag", "sock", "shoe", "run", "jump", "play", "sing", "love",
        "day", "night", "sky", "rain", "snow", "wind", "hill", "lake", "park", "zoo",
        "red", "blue", "pink", "gray", "one", "two", "six", "ten", "hot", "cold",
        "fun", "game", "food", "bed", "room", "home", "road", "shop", "farm", "sea",
        "map", "card", "gift", "ring", "time", "hour", "week", "year", "date", "job",
        "art", "song", "dance", "team", "goal", "kick", "swim", "ride", "walk", "talk",
        "eye", "ear", "hand", "foot", "face", "nose", "hair", "smile", "cry", "hug",
        "pet", "food", "cake", "pie", "jam", "tea", "cup", "bowl", "fork", "spoon"
    ],
    medium: [
        "apple", "banana", "carrot", "house", "school", "teacher", "student", "pencil",
        "paper", "chair", "table", "phone", "clock", "watch", "light", "window", "river",
        "ocean", "forest", "beach", "city", "market", "friend", "family", "mother", "father",
        "sister", "brother", "pizza", "bread", "juice", "coffee", "sugar", "chicken", "salad",
        "orange", "grape", "lemon", "shirt", "pants", "jacket", "money", "bank", "store",
        "party", "candle", "balloon", "travel", "plane", "train", "summer", "winter", "color",
        "green", "yellow", "purple", "number", "three", "four", "five", "movie", "actor",
        "ticket", "photo", "camera", "doctor", "nurse", "health", "swing", "slide", "storm",
        "butter", "cheese", "toast", "mouse", "rabbit", "turtle", "drive", "write", "draw",
        "learn", "laugh", "share", "dream", "cloud", "bridge", "garden", "office", "meeting",
        "smile", "dance", "music", "sport", "player", "score", "happy", "sad", "love", "hope"
    ],
    hard: [
        "elephant", "mountain", "hospital", "computer", "television", "restaurant", "pineapple",
        "strawberry", "watermelon", "blackberry", "blueberry", "apartment", "building", "village",
        "continent", "adventure", "treasure", "discovery", "knowledge", "education", "university",
        "scientist", "engineer", "medicine", "bandage", "surgery", "tournament", "champion",
        "strategy", "challenge", "victory", "landscape", "volcano", "hurricane", "tornado",
        "thunder", "lightning", "rainbow", "festival", "celebration", "tradition", "culture",
        "history", "museum", "painting", "sculpture", "literature", "philosophy", "democracy",
        "government", "economy", "business", "industry", "technology", "invention", "machine",
        "airplane", "submarine", "spaceship", "astronaut", "universe", "galaxy", "telescope",
        "microscope", "experiment", "research", "analysis", "solution", "problem", "creativity",
        "imagination", "inspiration", "motivation", "leadership", "community", "volunteer",
        "environment", "pollution", "recycle", "wildlife", "conservation", "agriculture", "harvest",
        "architecture", "construction", "furniture", "decoration", "fashion", "designer", "jewelry",
        "symphony", "orchestra", "performance", "rehearsal", "audience", "photography", "journalism"
    ]
};

// Function to scramble a word
function scrambleWord(word) {
    return word.split('').sort(() => Math.random() - 0.5).join('');
}

let currentWord = { scrambled: "", original: "" };
let score = 0;
let timeLeft = 30;
let timer;
let streak = 0;
let multiplier = 1;
let hintsLeft = 3;
let revealedLetters = 0;
let currentDifficulty = "";
let scoreHistory = JSON.parse(localStorage.getItem('scoreHistory')) || [];
let usedWords = []; // Track words used in this game session

const scrambledWordElement = document.getElementById("scrambled-word");
const userInput = document.getElementById("user-input");
const messageElement = document.getElementById("message");
const scoreElement = document.getElementById("score");
const timerElement = document.getElementById("timer");
const streakElement = document.getElementById("streak");
const multiplierElement = document.getElementById("multiplier");
const hintsLeftElement = document.getElementById("hints-left");
const submitBtn = document.getElementById("submit-btn");
const skipBtn = document.getElementById("skip-btn");
const hintBtn = document.getElementById("hint-btn");
const exitBtn = document.getElementById("exit-btn");
const startBtn = document.getElementById("start-btn");
const restartBtn = document.getElementById("restart-btn");
const clearScoresBtn = document.getElementById("clear-scores-btn");
const gameDiv = document.getElementById("game");
const endScreen = document.getElementById("end-screen");
const setupDiv = document.getElementById("setup");
const difficultySelect = document.getElementById("difficulty");
const endMessage = document.getElementById("end-message");
const scoreBoard = document.getElementById("score-board");
const correctSound = document.getElementById("correct-sound");
const wrongSound = document.getElementById("wrong-sound");

function generateWord(difficulty) {
    const wordList = wordLists[difficulty];
    let randomWord;
    // Pick a word not used in this session
    const availableWords = wordList.filter(word => !usedWords.includes(word));
    if (availableWords.length === 0) {
        usedWords = []; // Reset if all words used
        randomWord = wordList[Math.floor(Math.random() * wordList.length)];
    } else {
        randomWord = availableWords[Math.floor(Math.random() * availableWords.length)];
    }
    usedWords.push(randomWord);
    return { scrambled: scrambleWord(randomWord), original: randomWord };
}

function startGame() {
    currentDifficulty = difficultySelect.value;
    timeLeft = currentDifficulty === "easy" ? 40 : currentDifficulty === "medium" ? 30 : 20;
    score = 0;
    streak = 0;
    multiplier = 1;
    hintsLeft = 3;
    revealedLetters = 0;
    usedWords = []; // Reset used words for new game
    scoreElement.textContent = score;
    streakElement.textContent = streak;
    multiplierElement.textContent = `x${multiplier}`;
    hintsLeftElement.textContent = hintsLeft;
    timerElement.textContent = timeLeft;
    hintBtn.disabled = false;
    setupDiv.style.display = "none";
    gameDiv.style.display = "block";
    endScreen.style.display = "none";
    currentWord = generateWord(currentDifficulty);
    loadWord();
    // Preload audio to satisfy browser autoplay policies
    correctSound.load();
    wrongSound.load();
    timer = setInterval(updateTimer, 1000);
}

function loadWord() {
    scrambledWordElement.textContent = currentWord.scrambled;
    userInput.value = "";
    messageElement.textContent = "";
    messageElement.className = "";
    revealedLetters = 0;
    hintBtn.disabled = hintsLeft <= 0 || revealedLetters >= currentWord.original.length - 1;
}

function checkAnswer() {
    const answer = userInput.value.toLowerCase().trim();
    if (answer === currentWord.original.toLowerCase()) {
        streak++;
        multiplier = streak >= 5 ? 2 : streak >= 3 ? 1.5 : 1;
        const points = Math.round(10 * multiplier);
        score += points;
        scoreElement.textContent = score;
        streakElement.textContent = streak;
        multiplierElement.textContent = `x${multiplier}`;
        messageElement.textContent = `Correct! +${points} points`;
        messageElement.className = "correct";
        // Play sound with error handling
        correctSound.play().catch(error => {
            console.error("Correct sound playback failed:", error);
        });
        // Generate and load new word
        currentWord = generateWord(currentDifficulty);
        loadWord();
    } else {
        streak = 0;
        multiplier = 1;
        streakElement.textContent = streak;
        multiplierElement.textContent = `x${multiplier}`;
        messageElement.textContent = "Try again!";
        messageElement.className = "error";
        // Play sound with error handling
        wrongSound.play().catch(error => {
            console.error("Wrong sound playback failed:", error);
        });
    }
}

function skipWord() {
    streak = 0;
    multiplier = 1;
    streakElement.textContent = streak;
    multiplierElement.textContent = `x${multiplier}`;
    messageElement.textContent = "Skipped!";
    currentWord = generateWord(currentDifficulty);
    loadWord();
}

function getHint() {
    if (hintsLeft > 0 && revealedLetters < currentWord.original.length - 1) {
        const original = currentWord.original;
        let revealIndex;
        do {
            revealIndex = Math.floor(Math.random() * original.length);
        } while (currentWord.scrambled[revealIndex] === original[revealIndex]);
        let newScrambled = currentWord.scrambled.split('');
        newScrambled[revealIndex] = original[revealIndex];
        currentWord.scrambled = newScrambled.join('');
        scrambledWordElement.textContent = currentWord.scrambled;
        hintsLeft--;
        revealedLetters++;
        hintsLeftElement.textContent = hintsLeft;
        messageElement.textContent = "Hint used!";
        hintBtn.disabled = hintsLeft <= 0 || revealedLetters >= currentWord.original.length - 1;
    }
}

function exitGame() {
    clearInterval(timer);
    gameDiv.style.display = "none";
    endScreen.style.display = "block";
    endMessage.textContent = `Game Over! Final Score: ${score}`;
    const now = new Date();
    const timeString = now.toLocaleString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
    scoreHistory.push({ score, date: timeString, difficulty: currentDifficulty });
    localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
    updateScoreBoard();
}

function updateTimer() {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
        endGame();
    }
}

function endGame() {
    clearInterval(timer);
    gameDiv.style.display = "none";
    endScreen.style.display = "block";
    endMessage.textContent = `Game Over! Final Score: ${score}`;
    const now = new Date();
    const timeString = now.toLocaleString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
    scoreHistory.push({ score, date: timeString, difficulty: currentDifficulty });
    localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
    updateScoreBoard();
}

function updateScoreBoard() {
    scoreBoard.innerHTML = "";
    scoreHistory.slice(-5).reverse().forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `Score: ${entry.score} - ${entry.date} - Difficulty: ${entry.difficulty.charAt(0).toUpperCase() + entry.difficulty.slice(1)}`;
        scoreBoard.appendChild(li);
    });
}

function restartGame() {
    setupDiv.style.display = "block";
    endScreen.style.display = "none";
}

function clearScores() {
    scoreHistory = [];
    localStorage.setItem('scoreHistory', JSON.stringify(scoreHistory));
    updateScoreBoard();
}

startBtn.addEventListener("click", startGame);
submitBtn.addEventListener("click", checkAnswer);
skipBtn.addEventListener("click", skipWord);
hintBtn.addEventListener("click", getHint);
exitBtn.addEventListener("click", exitGame);
restartBtn.addEventListener("click", restartGame);
clearScoresBtn.addEventListener("click", clearScores);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") checkAnswer();
});

// Load score board on page load
updateScoreBoard();