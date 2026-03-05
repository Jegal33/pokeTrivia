import { createGameModule } from '../screens/game.js';
import { getRandomPokemon } from '../data/api.js';
import { getSettings } from '../data/storage.js';
import { t } from '../i18n.js';

const config = {
  async generateRounds(count) {
    const rounds = [];
    const settings = getSettings();
    const targetGen = settings.game2Gen || 0;
    const filterFn = targetGen > 0 ? (p) => p.generationId === targetGen : null;

    const correctAnswers = await getRandomPokemon(count, filterFn);

    for (let i = 0; i < count; i++) {
      const correctPoke = correctAnswers[i];
      const decoyOptions = await getRandomPokemon(3, p => p.id !== correctPoke.id && (!filterFn || filterFn(p)));
      const options = [...decoyOptions];
      const correctIdx = Math.floor(Math.random() * 4);
      options.splice(correctIdx, 0, correctPoke);

      rounds.push({
        question: t('game2Question'),
        answerId: correctPoke.id,
        html: `
          <div class="pokemon-display zoom-in-sprite">
            <img class="sprite-anim-idle" src="${correctPoke.sprite}" alt="Pokemon">
          </div>
          <div class="options-grid">
            ${options.map((p, idx) => `
              <button class="option-btn" data-correct="${idx === correctIdx}">
                ${p.name}
              </button>
            `).join('')}
          </div>
        `
      });
    }
    return rounds;
  }
};

export default createGameModule(config);
