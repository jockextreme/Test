let turn = 1;
let hp1 = 100;
let hp2 = 100;
let timer;
let timeLeft = 10;

const emojis = ['😀','😎','🤖','👻','🦄','🐱','🦊','🐸','🐵','🐼'];

function setRandomAvatar(player) {
  const emoji = emojis[Math.floor(Math.random() * emojis.length)];
  document.getElementById(`avatar${player}`).textContent = emoji;
}

document.getElementById('upload1').addEventListener('change', e => handleUpload(e, 1));
document.getElementById('upload2').addEventListener('change', e => handleUpload(e, 2));

function handleUpload(event, player) {
  const reader = new FileReader();
  reader.onload = function() {
    const img = document.createElement('img');
    img.src = reader.result;
    img.style.width = '60px';
    img.style.height = '60px';
    document.getElementById(`avatar${player}`).innerHTML = '';
    document.getElementById(`avatar${player}`).appendChild(img);
  };
  reader.readAsDataURL(event.target.files[0]);
}

function makeMove(action) {
  const opponent = turn === 1 ? 2 : 1;

  if (action === 'attack') {
    if (opponent === 1) hp1 -= 20;
    else hp2 -= 20;
  } else if (action === 'power') {
    if (turn === 1) hp1 += 15;
    else hp2 += 15;
  }

  updateUI();

  if (hp1 <= 0 || hp2 <= 0) {
    const winner = hp1 > hp2 ? 'Player 1' : 'Player 2';
    alert(winner + ' wins!');
    saveToLeaderboard(winner);
    resetGame();
    return;
  }

  turn = opponent;
  startTimer();
}

function updateUI() {
  document.getElementById('hp1').textContent = hp1;
  document.getElementById('hp2').textContent = hp2;
  document.getElementById('turn').textContent = 'Turn: Player ' + turn;
}

function startTimer() {
  clearInterval(timer);
  timeLeft = 10;
  document.getElementById('time').textContent = timeLeft;
  timer = setInterval(() => {
    timeLeft--;
    document.getElementById('time').textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timer);
      makeMove('attack');
    }
  }, 1000);
}

function sendMessage() {
  const input = document.getElementById('chat-input');
  const log = document.getElementById('chat-log');
  if (input.value.trim() === '') return;
  const msg = document.createElement('div');
  msg.textContent = `Player ${turn}: ${input.value}`;
  log.appendChild(msg);
  input.value = '';
  log.scrollTop = log.scrollHeight;
}

function saveToLeaderboard(winner) {
  const scores = JSON.parse(localStorage.getItem('leaderboard')) || {};
  scores[winner] = (scores[winner] || 0) + 1;
  localStorage.setItem('leaderboard', JSON.stringify(scores));
  renderLeaderboard();
}

function renderLeaderboard() {
  const scores = JSON.parse(localStorage.getItem('leaderboard')) || {};
  const list = document.getElementById('leaderboard-list');
  list.innerHTML = '';
  for (let player in scores) {
    const li = document.createElement('li');
    li.textContent = `${player}: ${scores[player]} wins`;
    list.appendChild(li);
  }
}

function resetGame() {
  hp1 = 100;
  hp2 = 100;
  turn = 1;
  updateUI();
}

renderLeaderboard();
startTimer();