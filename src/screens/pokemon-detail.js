import { playSound, playCry } from '../audio.js';
import { getStats } from '../data/storage.js';

export function showPokemonDetail(pokemon, fullList, parentContainer) {
    const modalOverlay = document.createElement('div');
    modalOverlay.style.position = 'absolute';
    modalOverlay.style.top = '0';
    modalOverlay.style.left = '0';
    modalOverlay.style.width = '100%';
    modalOverlay.style.height = '100%';
    modalOverlay.style.backgroundColor = 'rgba(0,0,0,0.6)';
    modalOverlay.style.display = 'flex';
    modalOverlay.style.justifyContent = 'center';
    modalOverlay.style.alignItems = 'center';
    modalOverlay.style.zIndex = '100';
    modalOverlay.style.padding = '16px';
    modalOverlay.className = 'animate-fade-in';

    const stats = getStats()[pokemon.id] || { correct: 0, incorrect: 0 };

    // Find evolutions if available
    let evolutionsHtml = '';
    if (pokemon.evoChainId) {
        const evos = fullList.filter(p => p.evoChainId === pokemon.evoChainId).sort((a, b) => a.id - b.id);
        if (evos.length > 1) {
            evolutionsHtml = `
              <div style="margin-top: 16px; border-top: 2px solid var(--gba-border-inner); padding-top: 8px;">
                <p style="font-size: 10px; text-transform: uppercase;">Cadena Evolutiva</p>
                <div style="display: flex; gap: 8px; overflow-x: auto; padding: 4px 0;">
                  ${evos.map(e => `
                    <div style="min-width: 48px; min-height: 48px; border: 2px solid ${e.id === pokemon.id ? 'var(--color-emerald-base)' : 'var(--gba-border-outer)'}; border-radius: 4px; padding: 2px; text-align: center;">
                       <img src="${e.sprite}" style="width: 100%; height: 100%; cursor: pointer;" onclick="window.loadEvo(${e.id})">
                    </div>
                  `).join('➔')}
                </div>
              </div>
            `;
        }
    }

    modalOverlay.innerHTML = `
      <div class="gba-window" style="width: 100%; max-width: 400px; max-height: 90vh; overflow-y: auto;">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 16px;">
            <div style="font-family: var(--font-pixel); font-size: 12px;">#${pokemon.id.toString().padStart(3, '0')}</div>
            <button class="btn btn-secondary" id="close-modal" style="padding: 4px 8px; font-size: 10px;">X</button>
        </div>
        
        <div style="display: flex; flex-direction: column; align-items: center; border-bottom: 2px solid var(--gba-border-inner); padding-bottom: 16px;">
            <img class="sprite-anim-idle" src="${pokemon.sprite}" alt="${pokemon.name}" style="width: 120px; height: 120px;">
            <button class="btn" id="play-cry-detail" style="padding: 4px; margin-top: -16px; margin-bottom: 8px; border-radius: 50%;">🔊</button>
            <h2 style="text-transform: capitalize; margin: 0;">${pokemon.name}</h2>
            <div style="display: flex; gap: 8px; margin-top: 8px;">
                ${pokemon.types.map(t => `<span style="background: var(--gba-border-outer); color: white; padding: 4px 8px; border-radius: 4px; font-size: 10px; text-transform: uppercase;">${t}</span>`).join('')}
            </div>
        </div>

        <div style="margin-top: 16px;">
            <p style="font-size: 10px; text-transform: uppercase;">Estadísticas (Minijuegos)</p>
            <div style="display: flex; justify-content: space-between; background: var(--color-bg-light); padding: 8px; border-radius: 4px; border: 2px solid var(--gba-border-inner); margin-top: 4px;">
                <div style="color: var(--color-correct); font-family: var(--font-pixel); font-size: 12px;">Aciertos: ${stats.correct}</div>
                <div style="color: var(--color-incorrect); font-family: var(--font-pixel); font-size: 12px;">Fallos: ${stats.incorrect}</div>
            </div>
        </div>

        <div style="margin-top: 16px; border-top: 2px solid var(--gba-border-inner); padding-top: 8px;">
            <p style="font-size: 10px; text-transform: uppercase;">Descripción</p>
            <div style="background: var(--color-bg-light); padding: 8px; border-radius: 4px; border: 2px solid var(--gba-border-inner); margin-top: 4px; font-family: var(--font-gba); font-size: 16px; line-height: 1.4; text-align: left;">
                ${pokemon.description || 'Sin descripción disponible.'}
            </div>
        </div>

        ${evolutionsHtml}
      </div>
    `;

    // Handle evo clicks globally since it's an inline onclick for simplicity
    window.loadEvo = (id) => {
        const evoPoke = fullList.find(p => p.id === id);
        if (evoPoke) {
            playSound('correct');
            modalOverlay.remove();
            showPokemonDetail(evoPoke, fullList, parentContainer);
        }
    };

    modalOverlay.querySelector('#close-modal').addEventListener('click', () => {
        playSound('hover');
        modalOverlay.remove();
        delete window.loadEvo; // cleanup
    });

    modalOverlay.querySelector('#play-cry-detail').addEventListener('click', () => {
        playCry(pokemon.id);
    });

    // Close on backdrop click
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            playSound('hover');
            modalOverlay.remove();
            delete window.loadEvo;
        }
    });

    parentContainer.appendChild(modalOverlay);

    // Play cry on open
    setTimeout(() => playCry(pokemon.id), 200);
}
