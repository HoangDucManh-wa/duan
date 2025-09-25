/*
  script.js - logic trò chơi Battle English
  Tách riêng file, không dùng thư viện ngoài.
*/

"use strict";

/* -------------------------
   Data câu hỏi (Tiếng Anh)
   format: { q: '...', choices: [...], answer: index (0-based), hint: '...' }
   ------------------------- */
const QUESTIONS = [
  {
    q: 'Choose the correct past form: "go"',
    choices: ["goed", "went", "gone", "goes"],
    answer: 1,
    hint: "Irregular verb",
  },
  {
    q: 'Which one is a synonym of "happy"?',
    choices: ["sad", "angry", "joyful", "tired"],
    answer: 2,
    hint: "Positive emotion",
  },
  {
    q: 'Complete: "I ____ to school every day."',
    choices: ["goes", "go", "going", "gone"],
    answer: 1,
    hint: "Subject is I",
  },
  {
    q: 'Pick the correct article: "___ apple a day keeps the doctor away."',
    choices: ["A", "An", "The", "No article"],
    answer: 1,
    hint: "Apple starts with vowel sound",
  },
  {
    q: 'Translate to English: "con mèo"',
    choices: ["dog", "cat", "mouse", "cow"],
    answer: 1,
    hint: "Common pet",
  },
  {
    q: "Which is a preposition?",
    choices: ["quick", "under", "happy", "blue"],
    answer: 1,
    hint: "Shows relationship",
  },
  {
    q: 'Correct comparative: "big"',
    choices: ["bigger", "more big", "most big", "biggest"],
    answer: 0,
    hint: "Compare two items",
  },
  {
    q: 'Choose the correct pronoun: "___ is my book."',
    choices: ["They", "This", "He", "It"],
    answer: 3,
    hint: "Single neutral object",
  },
  {
    q: "Which is an adjective?",
    choices: ["run", "red", "swim", "think"],
    answer: 1,
    hint: "Describes a noun",
  },
  {
    q: 'Fill: "She has ___ apples."',
    choices: ["much", "many", "a lot", "few"],
    answer: 1,
    hint: "Countable plural",
  },
];

/* -------------------------
   Game state
   ------------------------- */
let game = {
  questions: [],
  currentIndex: 0,
  playerHP: 100,
  enemyHP: 100,
  score: 0,
  inRound: false,
  perQuestionTime: 18,
  timer: null,
  timerLeft: 0,
};

/* -------------------------
   DOM references
   ------------------------- */
const startBtn = document.getElementById("startBtn");
const restartBtn = document.getElementById("restartBtn");
const messageEl = document.getElementById("message");
const qIndexEl = document.getElementById("qIndex");
const scoreEl = document.getElementById("score");
const questionCard = document.getElementById("questionCard");
const questionText = document.getElementById("questionText");
const choicesEl = document.getElementById("choices");
const hintEl = document.getElementById("hint");

const playerHPFill = document.getElementById("playerHPFill");
const enemyHPFill = document.getElementById("enemyHPFill");
const playerHPText = document.getElementById("playerHPText");
const enemyHPText = document.getElementById("enemyHPText");

const playerAvatar = document.getElementById("playerAvatar");
const enemyAvatar = document.getElementById("enemyAvatar");
const playerSword = document.getElementById("playerSword");
const enemySword = document.getElementById("enemySword");

const endSummary = document.getElementById("endSummary");

/* -------------------------
   Utils
   ------------------------- */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

/* -------------------------
   Initialize / Start
   ------------------------- */
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", resetToStart);

function startGame() {
  // reset state
  game.questions = QUESTIONS.slice();
  shuffle(game.questions);
  // keep 7 questions to make game interesting (or less if fewer exist)
  game.questions = game.questions.slice(0, Math.min(7, game.questions.length));
  game.currentIndex = 0;
  game.playerHP = 100;
  game.enemyHP = 100;
  game.score = 0;
  updateUI();
  startBtn.disabled = true;
  restartBtn.disabled = false;
  messageEl.textContent = "Trận đấu bắt đầu! Trả lời câu hỏi!";
  endSummary.hidden = true;
  showQuestion();
}

/* -------------------------
   Show question / choices
   ------------------------- */
function showQuestion() {
  game.inRound = true;
  const q = game.questions[game.currentIndex];
  qIndexEl.textContent = `Câu ${game.currentIndex + 1} / ${
    game.questions.length
  }`;
  scoreEl.textContent = `Điểm: ${game.score}`;
  questionCard.hidden = false;
  questionText.textContent = q.q;
  hintEl.hidden = true;

  // build choices (shuffle indexes)
  const choiceOrder = q.choices.map((_, i) => i);
  shuffle(choiceOrder);
  choicesEl.innerHTML = "";
  choiceOrder.forEach((ci, pos) => {
    const btn = document.createElement("button");
    btn.className = "choice-btn";
    btn.type = "button";
    btn.dataset.choiceIndex = ci; // original index
    btn.innerHTML = `<strong>${String.fromCharCode(65 + pos)}.</strong> ${
      q.choices[ci]
    }`;
    btn.addEventListener("click", onChoose);
    choicesEl.appendChild(btn);
  });

  // timer for question
  startTimer(game.perQuestionTime);
}

/* -------------------------
   Timer
   ------------------------- */
function startTimer(seconds) {
  clearTimer();
  game.timerLeft = seconds;
  updateTimerMessage();
  game.timer = setInterval(() => {
    game.timerLeft -= 1;
    updateTimerMessage();
    if (game.timerLeft <= 0) {
      clearTimer();
      onTimeOut();
    }
  }, 1000);
}

function clearTimer() {
  if (game.timer) {
    clearInterval(game.timer);
    game.timer = null;
  }
}

function updateTimerMessage() {
  messageEl.textContent = `Thời gian: ${game.timerLeft}s — Trả lời nhanh để gây nhiều sát thương!`;
}

/* -------------------------
   Handling answer
   ------------------------- */
function onChoose(evt) {
  if (!game.inRound) return;
  clearTimer();
  game.inRound = false;

  const chosenOriginalIndex = parseInt(
    evt.currentTarget.dataset.choiceIndex,
    10
  );
  const q = game.questions[game.currentIndex];
  const correctIndex = q.answer;

  // Disable all buttons
  Array.from(choicesEl.children).forEach((b) => (b.disabled = true));

  // mark correct / wrong
  Array.from(choicesEl.children).forEach((btn) => {
    const idx = parseInt(btn.dataset.choiceIndex, 10);
    if (idx === correctIndex) btn.classList.add("correct");
    if (idx === chosenOriginalIndex && idx !== correctIndex)
      btn.classList.add("wrong");
  });

  if (chosenOriginalIndex === correctIndex) {
    // correct: player attacks
    const damage = computeDamage(true);
    game.enemyHP = Math.max(0, game.enemyHP - damage);
    game.score += 10 + Math.floor(game.timerLeft || 0); // bonus for speed
    animatePlayerAttack();
    setTimeout(() => {
      updateHPBars();
      messageEl.textContent = `Trả lời đúng! Gây ${damage} sát thương.`;
      checkRoundEnd();
    }, 400);
  } else {
    // wrong: enemy counter-attacks
    const damage = computeDamage(false);
    game.playerHP = Math.max(0, game.playerHP - damage);
    game.score = Math.max(0, game.score - 5);
    animateEnemyAttack();
    setTimeout(() => {
      updateHPBars();
      messageEl.textContent = `Sai rồi! Bạn chịu ${damage} sát thương. Đọc gợi ý:`;
      showHint(q.hint);
      checkRoundEnd();
    }, 400);
  }
}

/* when time out */
function onTimeOut() {
  if (!game.inRound) return;
  game.inRound = false;
  // treat as wrong answer
  const damage = computeDamage(false);
  game.playerHP = Math.max(0, game.playerHP - damage);
  game.score = Math.max(0, game.score - 3);
  // disable buttons
  Array.from(choicesEl.children).forEach((b) => (b.disabled = true));
  animateEnemyAttack();
  setTimeout(() => {
    updateHPBars();
    messageEl.textContent = `Hết giờ! Bạn chịu ${damage} sát thương.`;
    showHint(game.questions[game.currentIndex].hint);
    checkRoundEnd();
  }, 400);
}

/* -------------------------
   Damage calculation
   ------------------------- */
function computeDamage(playerHit) {
  // base damage: random 12-22 for player, 8-18 for enemy
  if (playerHit) {
    // scale by remaining time -> faster => more damage
    const bonus = Math.max(0, Math.floor((game.timerLeft || 0) / 2));
    return Math.min(50, 12 + Math.floor(Math.random() * 10) + bonus);
  } else {
    return 8 + Math.floor(Math.random() * 10);
  }
}

/* -------------------------
   Animations
   ------------------------- */
function animatePlayerAttack() {
  playerAvatar.classList.add("attacking");
  enemyAvatar.classList.remove("hit");
  setTimeout(() => {
    playerAvatar.classList.remove("attacking");
    enemyAvatar.classList.add("hit");
    setTimeout(() => enemyAvatar.classList.remove("hit"), 350);
  }, 420);
}
function animateEnemyAttack() {
  enemyAvatar.classList.add("attacking");
  playerAvatar.classList.remove("hit");
  setTimeout(() => {
    enemyAvatar.classList.remove("attacking");
    playerAvatar.classList.add("hit");
    setTimeout(() => playerAvatar.classList.remove("hit"), 350);
  }, 420);
}

/* -------------------------
   HP update / check end
   ------------------------- */
function updateHPBars() {
  playerHPFill.style.width = `${game.playerHP}%`;
  enemyHPFill.style.width = `${game.enemyHP}%`;
  playerHPText.textContent = `${game.playerHP} / 100`;
  enemyHPText.textContent = `${game.enemyHP} / 100`;

  // color change when low
  playerHPFill.style.background =
    game.playerHP > 30 ? "" : "linear-gradient(90deg,#f97316,#ef4444)";
  enemyHPFill.style.background =
    game.enemyHP > 30 ? "" : "linear-gradient(90deg,#f97316,#ef4444)";
}

function checkRoundEnd() {
  updateHPBars();
  // check victory conditions
  if (game.enemyHP <= 0) {
    endGame(true);
    return;
  }
  if (game.playerHP <= 0) {
    endGame(false);
    return;
  }

  // next question after short delay
  setTimeout(() => {
    game.currentIndex += 1;
    if (game.currentIndex >= game.questions.length) {
      // if questions over, decide by HP
      decideByHP();
    } else {
      showQuestion();
    }
  }, 900);
}

function decideByHP() {
  if (game.enemyHP === game.playerHP) {
    endGame(false, "Hòa (giải quyết: kẻ địch thắng theo luật)"); // tie => enemy wins as tiebreak
  } else if (game.enemyHP < game.playerHP) {
    endGame(true);
  } else {
    endGame(false);
  }
}

/* -------------------------
   End game
   ------------------------- */
function endGame(playerWon, note) {
  clearTimer();
  questionCard.hidden = true;
  startBtn.disabled = false;
  restartBtn.disabled = false;
  endSummary.hidden = false;

  if (playerWon) {
    messageEl.textContent = "Bạn chiến thắng! Tuyệt vời!";
    endSummary.textContent = `Kết thúc: Bạn thắng! Điểm: ${game.score}${
      note ? " — " + note : ""
    }`;
  } else {
    messageEl.textContent = "Bạn thua. Cố lên lần sau!";
    endSummary.textContent = `Kết thúc: Bạn thua. Điểm: ${game.score}${
      note ? " — " + note : ""
    }`;
  }
}

/* -------------------------
   Misc UI helpers
   ------------------------- */
function updateUI() {
  qIndexEl.textContent = `Câu ${game.currentIndex} / ${
    game.questions.length || 0
  }`;
  scoreEl.textContent = `Điểm: ${game.score}`;
  updateHPBars();
}

function showHint(text) {
  if (!text) return;
  hintEl.textContent = `Gợi ý: ${text}`;
  hintEl.hidden = false;
}

/* -------------------------
   Reset
   ------------------------- */
function resetToStart() {
  clearTimer();
  game = {
    questions: [],
    currentIndex: 0,
    playerHP: 100,
    enemyHP: 100,
    score: 0,
    inRound: false,
    perQuestionTime: 18,
    timer: null,
    timerLeft: 0,
  };
  questionCard.hidden = true;
  startBtn.disabled = false;
  restartBtn.disabled = true;
  messageEl.textContent = "Nhấn Bắt đầu để chơi.";
  endSummary.hidden = true;
  updateHPBars();
  scoreEl.textContent = "Điểm: 0";
  qIndexEl.textContent = "Câu 0 / 0";
}

/* -------------------------
   Keyboard shortcuts
   ------------------------- */
window.addEventListener("keydown", (e) => {
  // 1-4 choose
  if (!questionCard.hidden && game.inRound && e.key >= "1" && e.key <= "4") {
    const idx = parseInt(e.key, 10) - 1;
    const btn = choicesEl.children[idx];
    if (btn && !btn.disabled) btn.click();
  }
});

/* initialize UI */
resetToStart();
function endGame(playerWon, note) {
  clearTimer();
  questionCard.hidden = true;
  startBtn.disabled = false;
  restartBtn.disabled = false;
  endSummary.hidden = false;

  if (playerWon) {
    messageEl.textContent = "Bạn chiến thắng! Tuyệt vời!";
    endSummary.textContent = `Chúc mừng bạn, bạn đã chiến thắng và bạn xứng đáng có được cô ấy. 
    Điểm: ${game.score}${note ? " — " + note : ""}`;
  } else {
    messageEl.textContent = "Bạn thua. Cố lên lần sau!";
    endSummary.textContent = `Bạn đã đánh mất cô ấy. 
    Điểm: ${game.score}${note ? " — " + note : ""}`;
  }
}
