import { navigate } from '../router.js';
import { playSound, playCry } from '../audio.js';
import { saveResult } from '../data/storage.js';

// Game Engine Factory
export function createGameModule(gameConfig) {
    return {
        async mount() {
            const container = document.createElement('div');
            container.className = 'game-container animate-fade-in';

            let currentRound = 0;
            let scoreCorrect = 0;
            let scoreIncorrect = 0;
            let roundData = [];
            const TOTAL_ROUNDS = 10;
            let isAnswered = false;

            // 1. Setup UI
            container.innerHTML = `
        <div class="game-header">
          <button class="btn btn-secondary" id="exit-btn" style="padding: 8px; font-size: 10px;">← Salir</button>
          <div class="score-board">
            <span class="score-correct">V: <span id="val-correct">0</span></span>
            <span class="score-incorrect">X: <span id="val-incorrect">0</span></span>
          </div>
        </div>
        
        <h2 id="question-text" style="text-align: center; font-size: 16px;">Cargando...</h2>

        <div class="game-area" id="game-area"></div>
        
        <div class="progress-container" id="progress-bar">
          ${Array(TOTAL_ROUNDS).fill('<div class="progress-dot"></div>').join('')}
        </div>
      `;

            const gameArea = container.querySelector('#game-area');
            const questionText = container.querySelector('#question-text');
            const progDots = container.querySelectorAll('.progress-dot');
            const valCorrect = container.querySelector('#val-correct');
            const valIncorrect = container.querySelector('#val-incorrect');

            container.querySelector('#exit-btn').addEventListener('click', () => {
                playSound('hover');
                navigate('menu');
            });

            // 2. Load Data for all rounds
            try {
                roundData = await gameConfig.generateRounds(TOTAL_ROUNDS);
                renderRound();
            } catch (e) {
                console.error("Error generating rounds", e);
                questionText.textContent = "Error al iniciar minijuego.";
                return container;
            }

            function renderRound() {
                if (currentRound >= TOTAL_ROUNDS) {
                    endGame();
                    return;
                }

                isAnswered = false;
                const data = roundData[currentRound];

                questionText.textContent = data.question;
                gameArea.innerHTML = data.html;

                // Execute setup actions like playing a cry or setting silhouettes
                if (data.onMount) {
                    data.onMount(gameArea);
                }

                // Attach listeners to options
                const optionBtns = gameArea.querySelectorAll('.option-btn');
                optionBtns.forEach(btn => {
                    btn.addEventListener('click', () => handleAnswer(btn, data));
                });
            }

            function handleAnswer(btnElement, data) {
                if (isAnswered) return;
                isAnswered = true;

                const isCorrect = btnElement.getAttribute('data-correct') === 'true';
                saveResult(data.answerId, isCorrect);

                if (isCorrect) {
                    scoreCorrect++;
                    valCorrect.textContent = scoreCorrect;
                    btnElement.classList.add('correct');
                    playCry(data.answerId);
                    progDots[currentRound].classList.add('active');
                } else {
                    scoreIncorrect++;
                    valIncorrect.textContent = scoreIncorrect;
                    btnElement.classList.add('incorrect');
                    playSound('incorrect');
                    progDots[currentRound].classList.add('wrong');

                    // Highlight correct option
                    const correctBtn = gameArea.querySelector('.option-btn[data-correct="true"]');
                    if (correctBtn) correctBtn.classList.add('correct');
                }

                // Action on reveal (like removing silhouette)
                if (data.onReveal) {
                    data.onReveal(gameArea);
                }

                setTimeout(() => {
                    currentRound++;
                    renderRound();
                }, 2000); // 2 seconds delay to see result
            }

            function endGame() {
                gameArea.innerHTML = `
          <div class="gba-window" style="text-align: center; width: 100%;">
            <h2>Resultados</h2>
            <div style="font-size: 24px; margin: 16px 0;">
              <span class="score-correct">V: ${scoreCorrect}</span> | 
              <span class="score-incorrect">X: ${scoreIncorrect}</span>
            </div>
            <button class="btn" id="replay-btn" style="width: 100%; margin-bottom: 8px;">Jugar de Nuevo</button>
            <button class="btn btn-secondary" id="menu-btn" style="width: 100%;">Volver al Menú</button>
          </div>
        `;
                questionText.textContent = "¡Partida Finalizada!";

                gameArea.querySelector('#replay-btn').addEventListener('click', async () => {
                    playSound('correct');
                    currentRound = 0; scoreCorrect = 0; scoreIncorrect = 0;
                    valCorrect.textContent = '0'; valIncorrect.textContent = '0';
                    progDots.forEach(d => { d.className = 'progress-dot'; });
                    questionText.textContent = "Cargando...";
                    gameArea.innerHTML = "";
                    roundData = await gameConfig.generateRounds(TOTAL_ROUNDS);
                    renderRound();
                });

                gameArea.querySelector('#menu-btn').addEventListener('click', () => {
                    playSound('hover');
                    navigate('menu');
                });
            }

            return container;
        },
        unmount() { }
    };
}
