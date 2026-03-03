import { navigate } from '../router.js';
import { playSound } from '../audio.js';

export default {
  async mount() {
    const container = document.createElement('div');
    container.className = 'game-container animate-fade-in';
    container.style.justifyContent = 'center';

    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: var(--color-emerald-dark); font-size: 2rem; margin-bottom: 8px;">PokéTrivia</h1>
        <p style="font-size: 14px; opacity: 0.8;">Atrápalos con el conocimiento</p>
      </div>

      <div class="gba-window" style="margin-bottom: 24px;">
        <div class="gba-window-content" style="display: flex; flex-direction: column; gap: 12px;">
          <button class="btn nav-btn" data-route="game1">1. ¿Cual es el Pokémon?</button>
          <button class="btn nav-btn" data-route="game2">2. Elige el Nombre</button>
          <button class="btn nav-btn" data-route="game3">3. Adivina el Tipo</button>
          <button class="btn nav-btn" data-route="game4">4. ¿Quién es ese Pokémon?</button>
          <button class="btn nav-btn" data-route="game5">5. Cadena Evolutiva</button>
          <button class="btn nav-btn" data-route="game6">6. Grito Pokémon</button>
        </div>
      </div>

      <div style="display: flex; gap: 16px; justify-content: center;">
        <button class="btn nav-btn" data-route="pokedex" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span>📖</span> Pokédex
        </button>
        <button class="btn btn-secondary nav-btn" data-route="settings" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span>⚙️</span> Ajustes
        </button>
      </div>
    `;

    // Add interaction sounds and routing
    const buttons = container.querySelectorAll('.nav-btn');
    buttons.forEach(btn => {
      btn.addEventListener('mouseenter', () => playSound('hover'));
      btn.addEventListener('click', (e) => {
        playSound('correct'); // Use correct chime as select sound
        const route = e.currentTarget.getAttribute('data-route');
        navigate(route);
      });
    });

    return container;
  },

  unmount() {
    // Cleanup if needed
  }
};
