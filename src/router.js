// Hash-based router
const routes = {
    '#menu': () => import('./screens/menu.js').then(m => m.default),
    '#tutorial': () => import('./screens/tutorial.js').then(m => m.default),
    '#settings': () => import('./screens/settings.js').then(m => m.default),
    '#pokedex': () => import('./screens/pokedex.js').then(m => m.default),
    '#game1': () => import('./games/game1.js').then(m => m.default),
    '#game2': () => import('./games/game2.js').then(m => m.default),
    '#game3': () => import('./games/game3.js').then(m => m.default),
    '#game4': () => import('./games/game4.js').then(m => m.default),
    '#game5': () => import('./games/game5.js').then(m => m.default),
    '#game6': () => import('./games/game6.js').then(m => m.default)
};

let appContainer = null;
let currentScreenMod = null;

export function initRouter(container) {
    appContainer = container;
    window.addEventListener('hashchange', handleRouteChange);
}

export function navigate(routeStr) {
    window.location.hash = routeStr.startsWith('#') ? routeStr : `#${routeStr}`;
}

async function handleRouteChange() {
    const hash = window.location.hash || '#menu';
    const loadRoute = routes[hash];

    if (!loadRoute) {
        console.warn('Route not found:', hash);
        navigate('menu');
        return;
    }

    // Cleanup previous screen if it has an unmount method
    if (currentScreenMod && typeof currentScreenMod.unmount === 'function') {
        currentScreenMod.unmount();
    }

    try {
        const screenMod = await loadRoute();
        currentScreenMod = screenMod;

        // Clear container and mount new screen
        appContainer.innerHTML = '';
        const screenElement = await screenMod.mount();
        if (screenElement) {
            appContainer.appendChild(screenElement);
        }
    } catch (err) {
        console.error('Error loading route:', err);
        appContainer.innerHTML = `
      <div class="gba-window">
        <h2 style="color: var(--color-incorrect);">Error</h2>
        <p>No se pudo cargar la pantalla.</p>
        <button class="btn" onclick="window.history.back()">Volver</button>
      </div>
    `;
    }
}
