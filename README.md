# PokéTrivia

## Qué es 

Una aplicación web para aprender los nombres de los pokemon.

### Funciones implementadas

- **6 minijuegos** con rondas de 10 preguntas, puntos de progreso, seguimiento de puntuación y resultados
- **Enciclopedia de la Pokédex** con 649 Pokémon, desplazamiento infinito y ventanas modales con detalles
- **Tutorial del Profesor Oak** con texto escrito a máquina en la primera visita
- **Ajustes** con volumen, modo oscuro/claro, borrado de datos con confirmación
- **Sistema de audio** con gritos y efectos de sonido sintetizados
- **PWA** configurable mediante vite-plugin-pwa (instalable, compatible sin conexión)

## Estructura del proyecto

```
pokelearn/
├── index.html                  # Root HTML
├── vite.config.js              # Vite + PWA config
├── public/icons/               # PWA icons
└── src/
    ├── main.js                 # Entry point, routing, init
    ├── router.js               # Hash-based SPA router
    ├── audio.js                # Audio manager (cries, SFX)
    ├── i18n.js                 # Language
    ├── data/
    │   ├── api.js              # PokeAPI fetcher + IndexedDB cache
    │   ├── db.js               # IndexedDB wrapper
    │   └── storage.js          # localStorage for preferences/stats
    ├── games/
    │   ├── game1.js            # Name → Image
    │   ├── game2.js            # Image → Name
    │   ├── game3.js            # Image → Type
    │   ├── game4.js            # Silhouettes
    │   ├── game5.js            # Evolution Chain
    │   └── game6.js            # Pokémon Cry
    ├── screens/
    │   ├── menu.js             # Main menu
    │   ├── tutorial.js         # Prof. Oak tutorial
    │   ├── settings.js         # Settings with clear data
    │   ├── game.js             # Shared game engine
    │   ├── pokedex.js          # Pokédex grid
    │   └── pokemon-detail.js   # Detail modal
    └── styles/
        ├── variables.css       # Theme system & palette
        ├── base.css            # Resets & globals
        ├── components.css      # Buttons, modals, animations
        └── games.css           # Game-specific layouts
```

## How to Run

```bash
cd pokeTrivia
npm install vite
npm run dev
# Open http://localhost:5173
```


