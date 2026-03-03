import { getSettings, saveSettings, clearAllData } from '../data/storage.js';
import { navigate } from '../router.js';
import { playSound } from '../audio.js';

export default {
    async mount() {
        const container = document.createElement('div');
        container.className = 'game-container animate-fade-in';
        container.style.justifyContent = 'center';

        const settings = getSettings();

        container.innerHTML = `
      <div class="gba-window">
        <h2 style="text-align: center; border-bottom: 2px solid var(--gba-border-inner); padding-bottom: 8px; margin-bottom: 16px;">Configuración</h2>
        
        <div style="display: flex; flex-direction: column; gap: 24px; padding: 8px;">
          
          <!-- Volume Control -->
          <div>
            <label style="display: block; font-family: var(--font-pixel); font-size: 12px; margin-bottom: 8px;">Volumen Global</label>
            <input type="range" id="volume-slider" min="0" max="1" step="0.1" value="${settings.volume}" style="width: 100%;">
          </div>

          <!-- Theme Toggle -->
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <label style="font-family: var(--font-pixel); font-size: 12px;">Modo Oscuro</label>
            <input type="checkbox" id="theme-toggle" ${settings.darkMode ? 'checked' : ''} style="transform: scale(1.5);">
          </div>
          
          <!-- Tutorial Replay -->
          <button id="replay-tutorial-btn" class="btn btn-secondary" style="width: 100%; font-size: 12px;">Ver Tutorial de Oak</button>

          <!-- Clear Data -->
          <div style="margin-top: 16px; border-top: 2px solid var(--gba-border-inner); padding-top: 16px;">
            <button id="clear-data-btn" class="btn btn-danger" style="width: 100%;">Borrar Datos Guardados</button>
            <p id="confirm-msg" class="hidden" style="color: var(--color-incorrect); font-size: 12px; text-align: center; margin-top: 8px;">¿Estás seguro? Presiona de nuevo para confirmar.</p>
          </div>
          
          <button id="back-btn" class="btn btn-secondary" style="width: 100%; margin-top: 24px; ">Volver</button>
        </div>


      </div>
    `;

        // Event Listeners
        const volSlider = container.querySelector('#volume-slider');
        volSlider.addEventListener('input', (e) => {
            settings.volume = parseFloat(e.target.value);
            saveSettings(settings);
            playSound('chillido');
        });

        const themeToggle = container.querySelector('#theme-toggle');
        themeToggle.addEventListener('change', (e) => {
            settings.darkMode = e.target.checked;
            saveSettings(settings);

            if (settings.darkMode) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.removeAttribute('data-theme');
            }
            playSound('hover');
        });

        const replayBtn = container.querySelector('#replay-tutorial-btn');
        replayBtn.addEventListener('click', () => {
            playSound('correct');
            navigate('tutorial');
        });

        const clearBtn = container.querySelector('#clear-data-btn');
        const confirmMsg = container.querySelector('#confirm-msg');
        let confirmClear = false;
        clearBtn.addEventListener('click', async () => {
            if (!confirmClear) {
                playSound('incorrect'); // Use buzzer to warn
                confirmMsg.classList.remove('hidden');
                clearBtn.textContent = "¡Confirmar Borrado!";
                confirmClear = true;

                // Reset after 3 seconds
                setTimeout(() => {
                    confirmClear = false;
                    confirmMsg.classList.add('hidden');
                    clearBtn.textContent = "Borrar Datos Guardados";
                }, 3000);
            } else {
                await clearAllData();
                window.location.reload(); // Reload to reset state fully
            }
        });

        const backBtn = container.querySelector('#back-btn');
        backBtn.addEventListener('click', () => {
            playSound('hover');
            navigate('menu');
        });

        return container;
    },

    unmount() { }
};
