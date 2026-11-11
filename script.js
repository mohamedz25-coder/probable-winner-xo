// Tic Tac Toe: human = 1 (X), AI = 2 (O), empty = 0.
// The AI uses the same Minimax decision-making approach as the Python version.

const HUMAN = 1;
const AI = 2;
const board = Array(9).fill(0);

const cells = [...document.querySelectorAll(".cell")];
const statusText = document.getElementById("status");
const humanScoreText = document.getElementById("human-score");
const aiScoreText = document.getElementById("ai-score");
const drawScoreText = document.getElementById("draw-score");
const humanScoreCard = document.getElementById("human-score-card");
const aiScoreCard = document.getElementById("ai-score-card");

let gameOver = false;
let humanScore = 0;
let aiScore = 0;
let drawScore = 0;

const winningLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

function getWinningLine(state, player) {
  return winningLines.find(line => line.every(index => state[index] === player)) || null;
}

function isBoardFull(state) {
  return state.every(square => square !== 0);
}

function minimax(state, depth, isMaximizing) {
  // Terminal states: AI win, human win, or draw.
  if (getWinningLine(state, AI)) return 10 - depth;
  if (getWinningLine(state, HUMAN)) return depth - 10;
  if (isBoardFull(state)) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < 9; i++) {
      if (state[i] === 0) {
        state[i] = AI;
        const score = minimax(state, depth + 1, false);
        state[i] = 0;
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let i = 0; i < 9; i++) {
      if (state[i] === 0) {
        state[i] = HUMAN;
        const score = minimax(state, depth + 1, true);
        state[i] = 0;
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}

function bestMove() {
  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === 0) {
      board[i] = AI;
      const score = minimax(board, 0, false);
      board[i] = 0;

      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  if (move !== -1) {
    board[move] = AI;
    return true;
  }
  return false;
}

function renderBoard(winningLine = null) {
  cells.forEach((cell, index) => {
    const value = board[index];
    cell.textContent = value === HUMAN ? "X" : value === AI ? "O" : "";
    cell.classList.toggle("x", value === HUMAN);
    cell.classList.toggle("o", value === AI);
    cell.classList.toggle("winning", winningLine?.includes(index) ?? false);
    cell.disabled = gameOver || value !== 0;
  });
}

function updateTurnIndicator(isHumanTurn) {
  humanScoreCard.classList.toggle("active", isHumanTurn && !gameOver);
  aiScoreCard.classList.toggle("active", !isHumanTurn && !gameOver);
}

function finishGame(winner) {
  gameOver = true;

  if (winner === HUMAN) {
    humanScore++;
    humanScoreText.textContent = humanScore;
    statusText.textContent = "You win! Great game.";
    renderBoard(getWinningLine(board, HUMAN));
  } else if (winner === AI) {
    aiScore++;
    aiScoreText.textContent = aiScore;
    statusText.textContent = "AI wins. Try again!";
    renderBoard(getWinningLine(board, AI));
  } else {
    drawScore++;
    drawScoreText.textContent = drawScore;
    statusText.textContent = "It's a draw!";
    renderBoard();
  }

  updateTurnIndicator(false);
}

function handleHumanMove(index) {
  if (gameOver || board[index] !== 0) return;

  board[index] = HUMAN;
  renderBoard();

  if (getWinningLine(board, HUMAN)) {
    finishGame(HUMAN);
    return;
  }
  if (isBoardFull(board)) {
    finishGame(null);
    return;
  }

  statusText.textContent = "AI is thinking...";
  updateTurnIndicator(false);
  cells.forEach(cell => cell.disabled = true);

  // Brief pause makes the AI's response feel natural.
  window.setTimeout(() => {
    if (gameOver) return;

    bestMove();

    if (getWinningLine(board, AI)) {
      finishGame(AI);
    } else if (isBoardFull(board)) {
      finishGame(null);
    } else {
      renderBoard();
      statusText.textContent = "Your turn — choose a square";
      updateTurnIndicator(true);
    }
  }, 350);
}

function newGame() {
  board.fill(0);
  gameOver = false;
  statusText.textContent = "Your turn — choose a square";
  renderBoard();
  updateTurnIndicator(true);
}

cells.forEach((cell, index) => {
  cell.addEventListener("click", () => handleHumanMove(index));
});

document.getElementById("restart").addEventListener("click", newGame);

newGame();
