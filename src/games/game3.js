import { createGameModule } from '../screens/game.js';
import { getRandomPokemon } from '../data/api.js';
import { t } from '../i18n.js';

const config = {
  async generateRounds(count) {
    const rounds = [];
    const correctAnswers = await getRandomPokemon(count);

    for (let i = 0; i < count; i++) {
      const correctPoke = correctAnswers[i];
      const mainType = correctPoke.types[0];

      // Need to ensure we pick options with DIFFERENT primary types to avoid confusion
      // So we get a pool and select 4 distinct types
      const pool = await getRandomPokemon(20);

      const options = [correctPoke];
      const usedTypes = new Set([mainType]);

      for (const p of pool) {
        const pType = p.types[0];
        if (!usedTypes.has(pType) && options.length < 4) {
          usedTypes.add(pType);
          options.push(p);
        }
      }

      // Fallback if not enough (rare)
      while (options.length < 4) {
        const next = (await getRandomPokemon(1))[0];
        options.push(next);
      }

      // Shuffle options since correct is currently at index 0
      options.sort(() => 0.5 - Math.random());
      const correctIdx = options.findIndex(o => o.id === correctPoke.id);

      rounds.push({
        question: t('game3Question'),
        answerId: correctPoke.id,
        html: `
          <div class="pokemon-display zoom-in-sprite">
            <img class="sprite-anim-idle" src="${correctPoke.sprite}" alt="Pokemon">
          </div>
          <div class="options-grid">
            ${options.map((p, idx) => {
          const primaryType = p.types[0];
          const translated = t(primaryType) || primaryType;
          return `
              <button class="option-btn" data-correct="${idx === correctIdx}">
                ${translated}
              </button>`;
        }).join('')}
          </div>
        `
      });
    }
    return rounds;
  }
};

export default createGameModule(config);
