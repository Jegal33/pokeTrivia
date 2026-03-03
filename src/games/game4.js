import { createGameModule } from '../screens/game.js';
import { getRandomPokemon } from '../data/api.js';
import { t } from '../i18n.js';

const config = {
  async generateRounds(count) {
    const rounds = [];
    for (let i = 0; i < count; i++) {
      const options = await getRandomPokemon(4);
      const correctIdx = Math.floor(Math.random() * 4);
      const correctPoke = options[correctIdx];

      rounds.push({
        question: t('game4Question'),
        answerId: correctPoke.id,
        html: `
          <div class="pokemon-display">
            <img class="sprite-anim-idle silhouette" id="silhouette-img" src="${correctPoke.sprite}" alt="Pokemon">
          </div>
          <div class="options-grid">
            ${options.map((p, idx) => `
              <button class="option-btn" data-correct="${idx === correctIdx}">
                ${p.name}
              </button>
            `).join('')}
          </div>
        `,
        onReveal: (gameArea) => {
          const img = gameArea.querySelector('#silhouette-img');
          if (img) {
            img.classList.remove('silhouette');
            img.classList.add('revealed');
          }
        }
      });
    }
    return rounds;
  }
};

export default createGameModule(config);
