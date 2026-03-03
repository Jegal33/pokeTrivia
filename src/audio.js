import { getSettings } from './data/storage.js';

const audioContext = new (window.AudioContext || window.webkitAudioContext)();
let cryAudio = new Audio();
let sfxAudio = new Audio();

export function playCry(pokemonId) {
    const settings = getSettings();
    if (settings.volume <= 0) return;

    cryAudio.src = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`;
    cryAudio.volume = settings.volume;
    cryAudio.play().catch(e => console.warn('Audio play failed:', e));
}

// Simple synthesized retro sounds for UI
export function playSound(type) {
    const settings = getSettings();
    if (settings.volume <= 0) return;

    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    gainNode.gain.value = settings.volume * 0.1; // Kept quiet

    const now = audioContext.currentTime;

    if (type === 'correct') {
        // High pitch chime
        osc.type = 'square';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.1);
        gainNode.gain.setValueAtTime(settings.volume * 0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        osc.start(now);
        osc.stop(now + 0.3);
    } else if (type === 'incorrect') {
        // Low buzzer
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(150, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.2);
        gainNode.gain.setValueAtTime(settings.volume * 0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    } else if (type === 'hover') {
        // Soft click
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        gainNode.gain.setValueAtTime(settings.volume * 0.05, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
        osc.start(now);
        osc.stop(now + 0.05);
    } else if (type === 'chillido') {
        // High pitched retro squeal for volume slider
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, now);
        osc.frequency.exponentialRampToValueAtTime(1600, now + 0.1);
        gainNode.gain.setValueAtTime(settings.volume * 0.1, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.start(now);
        osc.stop(now + 0.2);
    }
}
