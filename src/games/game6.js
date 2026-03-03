import { createGameModule } from '../screens/game.js';
import { getRandomPokemon } from '../data/api.js';

const config = {
    async generateRounds(count) {
        const rounds = [];
        for (let i = 0; i < count; i++) {
            const options = await getRandomPokemon(4);
            const correctIdx = Math.floor(Math.random() * 4);
            const correctPoke = options[correctIdx];

            rounds.push({
                question: `¿A quién le pertenece este grito?`,
                answerId: correctPoke.id,
                html: `
          <div class="pokemon-display" style="border: 2px dashed var(--gba-border-outer); border-radius: 50%;">
            <button class="btn" id="play-cry-btn" style="border-radius: 50%; width: 80px; height: 80px; font-size: 24px;">▶</button>
          </div>
          <div class="options-grid">
            ${options.map((p, idx) => `
              <button class="option-btn" data-correct="${idx === correctIdx}">
                ${p.name}
              </button>
            `).join('')}
          </div>
        `,
                onMount: (gameArea) => {
                    const btn = gameArea.querySelector('#play-cry-btn');
                    // Play automatically once rendered
                    setTimeout(() => btn.click(), 300);

                    btn.addEventListener('click', () => {
                        import('../audio.js').then(audio => audio.playCry(correctPoke.id));
                    });
                },
                onReveal: (gameArea) => {
                    // Show the sprite when revealed
                    const display = gameArea.querySelector('.pokemon-display');
                    if (display) {
                        display.style.border = 'none';
                        display.innerHTML = `<img class="animate-fade-in sprite-anim-idle" src="${correctPoke.sprite}" alt="Pokemon">`;
                    }
                }
            });
        }
        return rounds;
    }
};

export default createGameModule(config);
