import { createGameModule } from '../screens/game.js';
import { getRandomPokemon } from '../data/api.js';
import { t } from '../i18n.js';

const config = {
    async generateRounds(count) {
        const rounds = [];
        for (let i = 0; i < count; i++) {
            // Need to ensure we pick options with DIFFERENT primary types to avoid confusion
            // So we get a pool and select 4 distinct types
            const pool = await getRandomPokemon(20);

            const options = [];
            const usedTypes = new Set();

            for (const p of pool) {
                const mainType = p.types[0];
                if (!usedTypes.has(mainType) && options.length < 4) {
                    usedTypes.add(mainType);
                    options.push(p);
                }
            }

            // Fallback if not enough (rare)
            while (options.length < 4) {
                const next = (await getRandomPokemon(1))[0];
                options.push(next);
            }

            const correctIdx = Math.floor(Math.random() * 4);
            const correctPoke = options[correctIdx];

            rounds.push({
                question: t('game3Question'),
                answerId: correctPoke.id,
                html: `
          <div class="pokemon-display">
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
