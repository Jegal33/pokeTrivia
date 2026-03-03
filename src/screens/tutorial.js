import { navigate } from '../router.js';
import { getSettings, saveSettings } from '../data/storage.js';
import { playSound } from '../audio.js';

const dialogs = [
    "¡Hola! ¡Perdona por hacerte esperar!",
    "¡Bienvenido al mundo de los POKÉMON! Mi nombre es OAK.",
    "La gente suele llamarme el PROFESOR POKÉMON.",
    "Esta aplicación, PokéTrivia, te ayudará a conocer y memorizar datos sobre los POKÉMON.",
    "Podrás escuchar sus gritos, ver sus tipos, y adivinar sus siluetas.",
    "¡Hay 6 minijuegos distintos además de una Pokédex completa!",
    "¡Tu propia leyenda POKÉMON está a punto de comenzar!",
    "¡Adelante!"
];

export default {
    async mount() {
        const container = document.createElement('div');
        container.className = 'game-container animate-fade-in';
        container.style.justifyContent = 'space-between';
        container.style.alignItems = 'center';

        let currentDialog = 0;

        container.innerHTML = `
      <div style="flex-grow: 1; display: flex; align-items: center; justify-content: center;">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/25.png" alt="Oak Intro" style="width: 200px; filter: grayscale(100%); opacity: 0.5;" />
        <!-- We use Pikachu as a placeholder for Oak if we can't find Oak pixel art easily, wait actually we can just use a simple placeholder or text -->
        <div style="position: absolute; font-family: var(--font-pixel); font-size: 24px; top: 30%; text-shadow: 2px 2px 0 var(--color-emerald-base);">PROF. OAK</div>
      </div>

      <div class="dialog-box" style="width: 100%; position: relative; cursor: pointer; min-height: 100px; display: flex; align-items: center;">
        <span id="dialog-text" style="display: block;">${dialogs[currentDialog]}</span>
        <span class="animate-bob" style="position: absolute; right: 16px; bottom: 16px; color: var(--color-emerald-base);">▼</span>
      </div>
      
      <button id="skip-btn" class="btn" style="position: absolute; top: 16px; right: 16px; font-size: 10px; padding: 8px 16px;">Omitir</button>
    `;

        const dialogBox = container.querySelector('.dialog-box');
        const dialogText = container.querySelector('#dialog-text');
        const skipBtn = container.querySelector('#skip-btn');

        const finishTutorial = () => {
            const settings = getSettings();
            settings.tutorialSeen = true;
            saveSettings(settings);
            playSound('correct');
            navigate('menu');
        };

        dialogBox.addEventListener('click', () => {
            playSound('hover');
            currentDialog++;
            if (currentDialog >= dialogs.length) {
                finishTutorial();
            } else {
                dialogText.textContent = dialogs[currentDialog];
            }
        });

        skipBtn.addEventListener('click', finishTutorial);

        return container;
    },

    unmount() { }
};
