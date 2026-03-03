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
                question: `¿Cuál es el nombre de este Pokémon?`,
                answerId: correctPoke.id,
                html: `
          <div class="pokemon-display">
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
