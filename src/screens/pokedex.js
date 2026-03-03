import { navigate } from '../router.js';
import { getAllPokemon } from '../data/api.js';
import { playSound } from '../audio.js';
import { showPokemonDetail } from './pokemon-detail.js';

let fullList = [];
let currentIndex = 0;
const ITEMS_PER_PAGE = 50;

export default {
    async mount() {
        const container = document.createElement('div');
        container.className = 'game-container animate-fade-in';
        container.style.padding = '0'; // Maximize space

        container.innerHTML = `
      <div style="padding: 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 4px solid var(--gba-border-outer); background: var(--color-emerald-dark); color: white;">
        <h2 style="margin: 0;">Pokédex</h2>
        <button class="btn btn-secondary" id="exit-pokedex" style="padding: 4px 8px; font-size: 10px;">Volver</button>
      </div>
      
      <div id="pokedex-grid" class="pokedex-grid" style="flex-grow: 1;">
        <!-- Items go here -->
      </div>
      
      <div id="sentinel" style="height: 20px; width: 100%;"></div>
    `;

        const grid = container.querySelector('#pokedex-grid');
        const sentinel = container.querySelector('#sentinel');
        const exitBtn = container.querySelector('#exit-pokedex');

        exitBtn.addEventListener('click', () => {
            playSound('hover');
            navigate('menu');
        });

        try {
            fullList = await getAllPokemon();
            // Sort by ID is usually default, but let's be safe
            fullList.sort((a, b) => a.id - b.id);
            currentIndex = 0;
            loadMore();
        } catch (e) {
            grid.innerHTML = '<p>Error loading Pokedex</p>';
        }

        function renderCard(pokemon) {
            const card = document.createElement('div');
            card.className = 'pokemon-card animate-slide-up';
            card.innerHTML = `
            <img src="${pokemon.sprite}" alt="${pokemon.name}">
            <div class="name">#${pokemon.id.toString().padStart(3, '0')}</div>
            <div class="name" style="margin-top: 4px;">${pokemon.name}</div>
        `;
            card.addEventListener('click', () => {
                playSound('correct'); // select sound
                showPokemonDetail(pokemon, fullList, container);
            });
            return card;
        }

        function loadMore() {
            const fragment = document.createDocumentFragment();
            const endIndex = Math.min(currentIndex + ITEMS_PER_PAGE, fullList.length);

            for (let i = currentIndex; i < endIndex; i++) {
                fragment.appendChild(renderCard(fullList[i]));
            }

            grid.appendChild(fragment);
            currentIndex = endIndex;

            if (currentIndex >= fullList.length) {
                observer.disconnect();
            }
        }

        // Infinite Scroll Observer
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                loadMore();
            }
        }, { rootMargin: '100px' });

        observer.observe(sentinel);

        return container;
    },

    unmount() {
        fullList = [];
    }
};
