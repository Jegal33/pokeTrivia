import { createGameModule } from '../screens/game.js';
import { getAllPokemon, getRandomPokemon } from '../data/api.js';
import { t } from '../i18n.js';

const config = {
  async generateRounds(count) {
    const list = await getAllPokemon();
    // Group by chain
    const chains = {};
    for (const p of list) {
      if (!p.evoChainId) continue;
      if (!chains[p.evoChainId]) chains[p.evoChainId] = [];
      chains[p.evoChainId].push(p);
    }

    // Chains with at least 2 members
    const validChainsId = Object.keys(chains).filter(k => chains[k].length > 1);
    validChainsId.sort(() => 0.5 - Math.random()); // Shuffle valid chains

    const rounds = [];
    for (let i = 0; i < count; i++) {
      // Pick a chain from the shuffled list
      const randChainId = validChainsId[i % validChainsId.length];
      const chainMembers = chains[randChainId];

      // Sort by ID to guess base -> next evolution
      chainMembers.sort((a, b) => a.id - b.id);

      // Pick base
      const basePoke = chainMembers[0];
      // Pick correct evolution (e.g. 2nd member)
      const correctPoke = chainMembers[1];

      // Get 3 incorrect options that are NOT in this chain
      const incorrectPool = await getRandomPokemon(20, (p) => p.evoChainId !== Number(randChainId));
      const incorrectOpts = incorrectPool.slice(0, 3);

      const options = [...incorrectOpts, correctPoke].sort(() => 0.5 - Math.random());
      const correctIdx = options.findIndex(o => o.id === correctPoke.id);

      rounds.push({
        question: t('game5Question').replace(/este Pokémon|this Pokémon/gi, basePoke.name.toUpperCase()),
        answerId: correctPoke.id,
        html: `
          <div class="pokemon-display zoom-in-sprite">
            <img class="sprite-anim-idle" src="${basePoke.sprite}" alt="Pokemon Base">
          </div>
          <div class="options-grid">
            ${options.map((p, idx) => `
              <button class="option-btn" data-correct="${idx === correctIdx}">
                ${p.name.toUpperCase()}
              </button>
            `).join('')}
          </div>
        `,
        onReveal: (gameArea) => {
          const img = gameArea.querySelector('.pokemon-display img');
          if (img) {
            img.src = correctPoke.sprite;
            img.alt = correctPoke.name;
            img.style.transition = 'transform 0.4s ease-out';
            img.style.transform = 'scale(1.3)';
          }
        }
      });
    }
    return rounds;
  }
};

export default createGameModule(config);
