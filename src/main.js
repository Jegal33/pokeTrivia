import { initRouter, navigate } from './router.js';
import { loadData } from './data/api.js';
import { getSettings } from './data/storage.js';

// Initialize Theme
const settings = getSettings();
if (settings.darkMode) {
    document.documentElement.setAttribute('data-theme', 'dark');
}

// Entry Point
async function initApp() {
    const appContainer = document.getElementById('app');

    // Show Loading Screen
    appContainer.innerHTML = `
    <div class="game-container" style="justify-content: center; align-items: center; text-align: center;">
      <h1 class="animate-bob">Descargando Pokédex...</h1>
      <p id="loading-msg" style="margin-top: 16px; font-size: 14px;">Iniciando caché de datos...</p>
      <div class="progress-container" style="width: 100%; max-width: 300px; margin-top: 24px; background: var(--gba-border-outer); padding: 4px; border-radius: 8px;">
        <div id="loading-bar" style="height: 16px; background: var(--color-emerald-base); width: 0%; transition: width 0.2s; border-radius: 4px;"></div>
      </div>
    </div>
  `;

    // Fetch API & Initialize IndexedDB Cache
    try {
        await loadData((progress, msg) => {
            const bar = document.getElementById('loading-bar');
            const text = document.getElementById('loading-msg');
            if (bar) bar.style.width = `${progress}%`;
            if (text) text.textContent = msg;
        });

        // Initialize Router
        initRouter(appContainer);

        // Initial Navigation based on hash or default to menu
        const initialHash = window.location.hash || '#menu';
        // If it's the very first time (tutorial not seen), force tutorial
        if (!settings.tutorialSeen && initialHash !== '#tutorial') {
            navigate('tutorial');
        } else {
            // Just trigger the hashchange event to load the correct screen
            window.dispatchEvent(new Event('hashchange'));
        }

    } catch (err) {
        appContainer.innerHTML = `
      <div class="game-container" style="justify-content: center; align-items: center; text-align: center;">
        <h1 style="color: var(--color-incorrect);">Error de Conexión</h1>
        <p style="margin-top: 16px; font-size: 14px;">No se pudieron descargar los datos. Comprueba tu conexión a internet.</p>
        <button class="btn" style="margin-top: 24px;" onclick="window.location.reload()">Reintentar</button>
      </div>
    `;
        console.error("Initialization error:", err);
    }
}

document.addEventListener('DOMContentLoaded', initApp);
