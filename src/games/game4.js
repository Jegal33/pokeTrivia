import { createGameModule } from '../screens/game.js';
import { getRandomPokemon } from '../data/api.js';
import { t } from '../i18n.js';

const config = {
  async generateRounds(count) {
    const rounds = [];
    const correctAnswers = await getRandomPokemon(count);

    for (let i = 0; i < count; i++) {
      const correctPoke = correctAnswers[i];
      const decoyOptions = await getRandomPokemon(3, p => p.id !== correctPoke.id);
      const options = [...decoyOptions];
      const correctIdx = Math.floor(Math.random() * 4);
      options.splice(correctIdx, 0, correctPoke);

      rounds.push({
        question: t('game4Question'),
        answerId: correctPoke.id,
        html: `
          <div class="pokemon-display zoom-in-sprite">
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
