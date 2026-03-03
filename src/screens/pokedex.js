import { navigate } from '../router.js';
import { getAllPokemon } from '../data/api.js';
import { playSound } from '../audio.js';
import { showPokemonDetail } from './pokemon-detail.js';
import { getSettings, saveSettings } from '../data/storage.js';

let fullList = [];
let filteredList = [];
let currentIndex = 0;
const ITEMS_PER_PAGE = 50;

export default {
    async mount() {
        const container = document.createElement('div');
        container.className = 'game-container animate-fade-in';
        container.style.padding = '0'; // Maximize space

        let currentPage = 1;
        const ITEMS_PER_PAGE = 100;

        container.innerHTML = `
      <div style="padding: 16px; display: flex; align-items: center; justify-content: space-between; border-bottom: 4px solid var(--gba-border-outer); background: var(--color-emerald-dark); color: white;">
        <h2 style="margin: 0; font-size: 1.2rem;">Pokédex</h2>
        <div style="display: flex; gap: 8px;">
            <button class="btn btn-secondary" id="toggle-mute" style="padding: 4px 8px; font-size: 10px;">🔊</button>
            <button class="btn btn-secondary" id="exit-pokedex" style="padding: 4px 8px; font-size: 10px;">Volver</button>
        </div>
      </div>

      <div style="padding: 8px 16px; display: flex; gap: 8px; background: var(--color-bg-modal); border-bottom: 4px solid var(--gba-border-outer);">
        <select id="filter-type" class="btn btn-secondary" style="flex: 1; padding: 4px; font-size: 10px;">
          <option value="">Todos los tipos</option>
          <option value="normal">Normal</option>
          <option value="fighting">Lucha</option>
          <option value="flying">Volador</option>
          <option value="poison">Veneno</option>
          <option value="ground">Tierra</option>
          <option value="rock">Roca</option>
          <option value="bug">Bicho</option>
          <option value="ghost">Fantasma</option>
          <option value="steel">Acero</option>
          <option value="fire">Fuego</option>
          <option value="water">Agua</option>
          <option value="grass">Planta</option>
          <option value="electric">Eléctrico</option>
          <option value="psychic">Psíquico</option>
          <option value="ice">Hielo</option>
          <option value="dragon">Dragón</option>
          <option value="dark">Siniestro</option>
          <option value="fairy">Hada</option>
        </select>
        <select id="filter-gen" class="btn btn-secondary" style="flex: 1; padding: 4px; font-size: 10px;">
            <option value="">Todas las Gens.</option>
            <option value="1">Generación 1</option>
            <option value="2">Generación 2</option>
            <option value="3">Generación 3</option>
            <option value="4">Generación 4</option>
            <option value="5">Generación 5</option>
            <option value="6">Generación 6</option>
            <option value="7">Generación 7</option>
            <option value="8">Generación 8</option>
            <option value="9">Generación 9</option>
        </select>
      </div>
      
      <div id="pokedex-grid" class="pokedex-grid" style="flex-grow: 1;">
        <!-- Items go here -->
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; padding: 16px; border-top: 4px solid var(--gba-border-outer); background: var(--color-bg-modal);">
          <button class="btn btn-secondary" id="prev-page" style="padding: 8px 16px; font-size: 12px;">◄ Ant.</button>
          <span id="page-indicator" style="font-family: var(--font-pixel); font-size: 10px;">Página 1</span>
          <button class="btn btn-secondary" id="next-page" style="padding: 8px 16px; font-size: 12px;">Sig. ►</button>
      </div>
    `;

        const grid = container.querySelector('#pokedex-grid');
        const exitBtn = container.querySelector('#exit-pokedex');
        const muteBtn = container.querySelector('#toggle-mute');
        const prevBtn = container.querySelector('#prev-page');
        const nextBtn = container.querySelector('#next-page');
        const pageIndicator = container.querySelector('#page-indicator');
        const filterType = container.querySelector('#filter-type');
        const filterGen = container.querySelector('#filter-gen');

        function applyFilters() {
            const type = filterType.value;
            const gen = filterGen.value;
            filteredList = fullList.filter(p => {
                let matchType = true;
                if (type) matchType = p.types.includes(type);

                let matchGen = true;
                if (gen) matchGen = p.generationId === parseInt(gen);

                return matchType && matchGen;
            });
            currentPage = 1;
            renderPage();
        }

        filterType.addEventListener('change', () => {
            playSound('hover');
            applyFilters();
        });

        filterGen.addEventListener('change', () => {
            playSound('hover');
            applyFilters();
        });

        // Logic for configuring mute auto-cry
        const settings = getSettings();

        const updateMuteBtnState = () => {
            muteBtn.textContent = settings.pokedexMuteAutoCry ? '🔇' : '🔊';
            muteBtn.style.opacity = settings.pokedexMuteAutoCry ? '0.6' : '1';
        };
        updateMuteBtnState();

        muteBtn.addEventListener('click', () => {
            playSound('hover');
            settings.pokedexMuteAutoCry = !settings.pokedexMuteAutoCry;
            saveSettings(settings);
            updateMuteBtnState();
        });

        exitBtn.addEventListener('click', () => {
            playSound('hover');
            navigate('menu');
        });

        try {
            fullList = await getAllPokemon();
            // Sort by ID is usually default, but let's be safe
            fullList.sort((a, b) => a.id - b.id);
            filteredList = [...fullList];
            currentPage = 1;
            renderPage();
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

        function renderPage() {
            grid.innerHTML = '';
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredList.length);
            const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE) || 1;

            const fragment = document.createDocumentFragment();
            for (let i = startIndex; i < endIndex; i++) {
                fragment.appendChild(renderCard(filteredList[i]));
            }
            grid.appendChild(fragment);

            pageIndicator.textContent = `Página ${currentPage} / ${totalPages}`;

            prevBtn.disabled = currentPage === 1;
            prevBtn.style.opacity = currentPage === 1 ? '0.5' : '1';

            nextBtn.disabled = currentPage === totalPages;
            nextBtn.style.opacity = currentPage === totalPages ? '0.5' : '1';

            // Scroll to top of grid
            grid.scrollTop = 0;
        }

        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                playSound('hover');
                currentPage--;
                renderPage();
            }
        });

        nextBtn.addEventListener('click', () => {
            const totalPages = Math.ceil(filteredList.length / ITEMS_PER_PAGE) || 1;
            if (currentPage < totalPages) {
                playSound('hover');
                currentPage++;
                renderPage();
            }
        });

        return container;
    },

    unmount() {
        fullList = [];
        filteredList = [];
    }
};
