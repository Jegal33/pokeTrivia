import { navigate } from '../router.js';
import { getSettings, saveSettings } from '../data/storage.js';
import { playSound } from '../audio.js';
import { t } from '../i18n.js';

export default {
  async mount() {
    const container = document.createElement('div');
    container.className = 'game-container animate-fade-in';
    container.style.justifyContent = 'center';

    container.innerHTML = `
      <div style="text-align: center; margin-bottom: 32px;">
        <h1 style="color: var(--color-emerald-dark); font-size: 2rem; margin-bottom: 8px;">PokéTrivia</h1>
        <p style="font-size: 14px; opacity: 0.8;">${t('subtitle')}</p>
      </div>

      <div class="gba-window" style="margin-bottom: 24px;">
        <div class="gba-window-content" style="display: flex; flex-direction: column; gap: 12px;">
          <div style="display: flex; gap: 8px;">
            <button class="btn nav-btn" data-route="game1" style="flex: 1;">${t('game1')}</button>
            <button class="btn btn-secondary gen-btn" data-game="1" style="padding: 0 12px;" title="${t('selectGen')}">⚙️</button>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn nav-btn" data-route="game2" style="flex: 1;">${t('game2')}</button>
            <button class="btn btn-secondary gen-btn" data-game="2" style="padding: 0 12px;" title="${t('selectGen')}">⚙️</button>
          </div>
          <button class="btn nav-btn" data-route="game3">${t('game3')}</button>
          <button class="btn nav-btn" data-route="game4">${t('game4')}</button>
          <button class="btn nav-btn" data-route="game5">${t('game5')}</button>
          <button class="btn nav-btn" data-route="game6">${t('game6')}</button>
        </div>
      </div>

      <div style="display: flex; gap: 16px; justify-content: center;">
        <button class="btn nav-btn" data-route="pokedex" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span>📖</span> ${t('pokedex')}
        </button>
        <button class="btn btn-secondary nav-btn" data-route="settings" style="flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;">
          <span>⚙️</span> ${t('settings')}
        </button>
      </div>

      <div id="gen-modal" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.6); display: none; align-items: center; justify-content: center; z-index: 100; padding: 16px;">
        <div class="gba-window" style="width: 100%; max-width: 400px; display: flex; flex-direction: column; max-height: 80vh;">
          <h2 style="text-align: center; margin-bottom: 16px; font-size: 14px;">${t('selectGen')}</h2>
          <div id="gen-options" style="display: flex; flex-direction: column; gap: 8px; overflow-y: auto; padding-right: 4px; padding-bottom: 8px;">
            <!-- Buttons injected here -->
          </div>
          <button class="btn btn-secondary" id="close-modal-btn" style="width: 100%; margin-top: 8px;">${t('back')}</button>
        </div>
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

    // Generation Modal Logic
    const genModal = container.querySelector('#gen-modal');
    const closeBtn = container.querySelector('#close-modal-btn');
    const genOptionsContainer = container.querySelector('#gen-options');
    let currentGameForModal = 1;

    const openModal = (gameId) => {
      currentGameForModal = gameId;
      const settings = getSettings();
      const currentGen = gameId === 1 ? settings.game1Gen : settings.game2Gen;

      genOptionsContainer.innerHTML = '';

      const gens = [
        { id: 0, label: t('allGens') },
        { id: 1, label: t('gen1') },
        { id: 2, label: t('gen2') },
        { id: 3, label: t('gen3') },
        { id: 4, label: t('gen4') },
        { id: 5, label: t('gen5') },
        { id: 6, label: t('gen6') },
        { id: 7, label: t('gen7') },
        { id: 8, label: t('gen8') },
        { id: 9, label: t('gen9') }
      ];

      gens.forEach(gen => {
        const btn = document.createElement('button');
        btn.className = `btn ${currentGen === gen.id ? '' : 'btn-secondary'}`;
        btn.style.textAlign = 'left';
        btn.style.padding = '8px 12px';
        btn.textContent = gen.label;
        btn.addEventListener('click', () => {
          playSound('correct');
          settings[`game${currentGameForModal}Gen`] = gen.id;
          saveSettings(settings);
          genModal.style.display = 'none';
        });
        genOptionsContainer.appendChild(btn);
      });

      genModal.style.display = 'flex';
    };

    const genButtons = container.querySelectorAll('.gen-btn');
    genButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        playSound('hover');
        const gameId = parseInt(e.currentTarget.getAttribute('data-game'));
        openModal(gameId);
      });
    });

    closeBtn.addEventListener('click', () => {
      playSound('hover');
      genModal.style.display = 'none';
    });

    return container;
  },

  unmount() {
    // Cleanup if needed
  }
};
