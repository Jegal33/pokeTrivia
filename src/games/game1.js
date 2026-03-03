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
                question: `¿Cuál es el Pokémon\n${correctPoke.name.toUpperCase()}?`,
                answerId: correctPoke.id,
                html: `
          <div class="options-grid" style="grid-template-columns: 1fr 1fr;">
            ${options.map((p, idx) => `
              <button class="option-btn" data-correct="${idx === correctIdx}" style="padding: 8px; display: flex; justify-content: center; align-items: center; height: 120px;">
                <img src="${p.sprite}" alt="${p.name}" style="transform: scale(1.5);">
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
