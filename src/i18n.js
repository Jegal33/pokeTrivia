import { getSettings, saveSettings } from './data/storage.js';

const translations = {
    es: {
        // General
        pokedex: 'Pokédex',
        settings: 'Ajustes',
        back: 'Volver',
        nextPage: 'Sig. ►',
        prevPage: '◄ Ant.',
        page: 'Página',

        // Menu
        subtitle: 'Conócelos a todos',
        game1: '1. ¿Cual es el Pokémon?',
        game2: '2. Elige el Nombre',
        game3: '3. Adivina el Tipo',
        game4: '4. ¿Quién es ese Pokémon?',
        game5: '5. Cadena Evolutiva',
        game6: '6. Grito Pokémon',
        tutorial: 'Tutorial',

        // Settings
        volume: 'Volumen',
        darkMode: 'Modo Oscuro',
        language: 'Idioma',
        resetData: 'Borrar Datos',
        resetConfirm: '¿Seguro que quieres borrar todos los datos?',

        // Pokedex Filters
        allTypes: 'Todos los tipos',
        allGens: 'Todas las Gens.',
        normal: 'Normal',
        fighting: 'Lucha',
        flying: 'Volador',
        poison: 'Veneno',
        ground: 'Tierra',
        rock: 'Roca',
        bug: 'Bicho',
        ghost: 'Fantasma',
        steel: 'Acero',
        fire: 'Fuego',
        water: 'Agua',
        grass: 'Planta',
        electric: 'Eléctrico',
        psychic: 'Psíquico',
        ice: 'Hielo',
        dragon: 'Dragón',
        dark: 'Siniestro',
        fairy: 'Hada',

        gen1: 'Generación 1', gen2: 'Generación 2', gen3: 'Generación 3',
        gen4: 'Generación 4', gen5: 'Generación 5', gen6: 'Generación 6',
        gen7: 'Generación 7', gen8: 'Generación 8', gen9: 'Generación 9',

        // Games
        score: 'Aciertos',
        errors: 'Errores',
        loading: 'Cargando Ronda...',
        game1Question: '¿Cuál es el Pokémon\n{name}?',
        game2Question: '¿De quién es esta silueta?',
        game3Question: '¿De qué tipo es este Pokémon?',
        game4Question: '¿Quién es ese Pokémon?',
        game5Question: '¿Cuál es la evolución de este Pokémon?',
        game6Question: '¿De qué Pokémon es este grito?',
        typeNone: 'Ninguno',
        selectGen: 'Elegir Generación',
        gameGen: 'Generación:',

        // Tutorial
        tutorialLine1: '¡Hola! ¡Perdona por hacerte esperar!',
        tutorialLine2: '¡Bienvenido al mundo de los POKÉMON! Mi nombre es OAK.',
        tutorialLine3: 'La gente suele llamarme el PROFESOR POKÉMON.',
        tutorialLine4: 'Esta aplicación, PokéTrivia, te ayudará a conocer y memorizar datos.',
        tutorialLine5: 'Podrás escuchar sus gritos, ver sus tipos, y adivinar sus siluetas.',
        tutorialLine6: '¡Hay 6 minijuegos distintos además de una Pokédex completa!',
        tutorialLine7: '¡Tu propia leyenda POKÉMON está a punto de comenzar!',
        tutorialLine8: '¡Adelante!',
        skip: 'Omitir',

        // Details & Main
        evoChain: 'Cadena Evolutiva',
        statsMini: 'Estadísticas (Minijuegos)',
        hits: 'Aciertos',
        misses: 'Fallos',
        descTitle: 'Descripción',
        noDesc: 'Sin descripción disponible.',
        downloading: 'Descargando Pokédex...',
        loadingCache: 'Iniciando caché de datos...',
        connError: 'Error de Conexión',
        connErrorDesc: 'No se pudieron descargar los datos. Comprueba tu conexión a internet.',
        retry: 'Reintentar'
    },
    en: {
        // General
        pokedex: 'Pokédex',
        settings: 'Settings',
        back: 'Back',
        nextPage: 'Next ►',
        prevPage: '◄ Prev',
        page: 'Page',

        // Menu
        subtitle: 'Gotta catch \'em all',
        game1: '1. Which Pokémon is this?',
        game2: '2. Choose the Name',
        game3: '3. Guess the Type',
        game4: '4. Who\'s that Pokémon?',
        game5: '5. Evolutionary Chain',
        game6: '6. Pokémon Cry',
        tutorial: 'Tutorial',

        // Settings
        volume: 'Volume',
        darkMode: 'Dark Mode',
        language: 'Language',
        resetData: 'Reset Data',
        resetConfirm: 'Are you sure you want to delete all data?',

        // Pokedex Filters
        allTypes: 'All Types',
        allGens: 'All Gens',
        normal: 'Normal',
        fighting: 'Fighting',
        flying: 'Flying',
        poison: 'Poison',
        ground: 'Ground',
        rock: 'Rock',
        bug: 'Bug',
        ghost: 'Ghost',
        steel: 'Steel',
        fire: 'Fire',
        water: 'Water',
        grass: 'Grass',
        electric: 'Electric',
        psychic: 'Psychic',
        ice: 'Ice',
        dragon: 'Dragon',
        dark: 'Dark',
        fairy: 'Fairy',

        gen1: 'Generation 1', gen2: 'Generation 2', gen3: 'Generation 3',
        gen4: 'Generation 4', gen5: 'Generation 5', gen6: 'Generation 6',
        gen7: 'Generation 7', gen8: 'Generation 8', gen9: 'Generation 9',

        // Games
        score: 'Correct',
        errors: 'Errors',
        loading: 'Loading Round...',
        game1Question: 'Which Pokémon is\n{name}?',
        game2Question: 'Whose silhouette is this?',
        game3Question: 'What type is this Pokémon?',
        game4Question: 'Who\'s that Pokémon?',
        game5Question: 'What is the evolution of this Pokémon?',
        game6Question: 'Whose cry is this?',
        typeNone: 'None',
        selectGen: 'Select Generation',
        gameGen: 'Generation:',

        // Tutorial
        tutorialLine1: 'Hello there! Sorry to keep you waiting!',
        tutorialLine2: 'Welcome to the world of POKÉMON! My name is OAK.',
        tutorialLine3: 'People affectionately refer to me as the POKÉMON PROF.',
        tutorialLine4: 'This application, PokéTrivia, will help you learn facts.',
        tutorialLine5: 'You will listen to their cries, learn types, and guess silhouettes.',
        tutorialLine6: 'There are 6 different minigames plus a full Pokédex!',
        tutorialLine7: 'Your very own POKÉMON legend is about to unfold!',
        tutorialLine8: 'Let\'s go!',
        skip: 'Skip',

        // Details & Main
        evoChain: 'Evolutionary Chain',
        statsMini: 'Stats (Minigames)',
        hits: 'Correct',
        misses: 'Misses',
        descTitle: 'Description',
        noDesc: 'No description available.',
        downloading: 'Downloading Pokédex...',
        loadingCache: 'Initializing data cache...',
        connError: 'Connection Error',
        connErrorDesc: 'Could not download data. Check your internet connection.',
        retry: 'Retry'
    }
};

let currentLang = 'es';

export function initI18n() {
    const settings = getSettings();
    if (settings.language) {
        currentLang = settings.language;
    } else {
        // set default to spanish based on previous usage
        settings.language = 'es';
        saveSettings(settings);
    }
}

export function setLanguage(lang) {
    if (translations[lang]) {
        currentLang = lang;
        const settings = getSettings();
        settings.language = lang;
        saveSettings(settings);
        // Dispatch an event so UI can react without reloading if we want
        window.dispatchEvent(new Event('languagechanged'));
    }
}

export function getLanguage() {
    return currentLang;
}

export function t(key) {
    return translations[currentLang][key] || key;
}
