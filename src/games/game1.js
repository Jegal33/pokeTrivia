import { createGameModule } from '../screens/game.js';
import { getRandomPokemon } from '../data/api.js';
import { getSettings } from '../data/storage.js';
import { t } from '../i18n.js';

const config = {
  async generateRounds(count) {
    const rounds = [];
    const settings = getSettings();
    const targetGen = settings.game1Gen || 0;
    const filterFn = targetGen > 0 ? (p) => p.generationId === targetGen : null;

    const correctAnswers = await getRandomPokemon(count, filterFn);

    for (let i = 0; i < count; i++) {
      const correctPoke = correctAnswers[i];
      const decoyOptions = await getRandomPokemon(3, p => p.id !== correctPoke.id && (!filterFn || filterFn(p)));
      const options = [...decoyOptions];
      const correctIdx = Math.floor(Math.random() * 4);
      options.splice(correctIdx, 0, correctPoke);

      rounds.push({
        question: t('game1Question').replace('{name}', correctPoke.name.toUpperCase()),
        answerId: correctPoke.id,
        html: `
          <div class="options-grid" style="grid-template-columns: 1fr 1fr;">
            ${options.map((p, idx) => `
              <button class="option-btn" data-correct="${idx === correctIdx}" style="padding: 8px; display: flex; justify-content: center; align-items: center; height: 120px;">
                <img src="${p.sprite}" alt="${p.name}" style="transform: scale(1.3); max-width: 100%; max-height: 100%; object-fit: contain;">
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
