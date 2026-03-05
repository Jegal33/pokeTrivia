const STORAGE_KEY = 'pokelearn_prefs';
const STATS_KEY = 'pokelearn_stats';

const defaultSettings = {
    volume: 0.5,
    darkMode: false,
    tutorialSeen: false,
    pokedexMuteAutoCry: false,
    game1Gen: 0,
    game2Gen: 0
};

export function getSettings() {
    try {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? { ...defaultSettings, ...JSON.parse(data) } : defaultSettings;
    } catch (e) {
        console.error("Error reading settings", e);
        return defaultSettings;
    }
}

export function saveSettings(settings) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

// Stats Structure: { [pokemonId]: { correct: number, incorrect: number } }
export function getStats() {
    try {
        const data = localStorage.getItem(STATS_KEY);
        return data ? JSON.parse(data) : {};
    } catch (e) {
        console.error("Error reading stats", e);
        return {};
    }
}

export function saveResult(pokemonId, isCorrect) {
    const stats = getStats();
    if (!stats[pokemonId]) {
        stats[pokemonId] = { correct: 0, incorrect: 0 };
    }

    if (isCorrect) {
        stats[pokemonId].correct++;
    } else {
        stats[pokemonId].incorrect++;
    }

    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
}

import { clearPokedex } from './db.js';

export async function clearAllData() {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STATS_KEY);
    await clearPokedex();
}
