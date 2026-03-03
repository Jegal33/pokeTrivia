import { openDB } from 'idb';

const DB_NAME = 'pokelearn_db';
const DB_VERSION = 1;
const STORE_POKEMON = 'pokemon_list';

let dbPromise = null;

function getDb() {
    if (!dbPromise) {
        dbPromise = openDB(DB_NAME, DB_VERSION, {
            upgrade(db) {
                if (!db.objectStoreNames.contains(STORE_POKEMON)) {
                    // We'll store objects like: { id: 1, name: 'bulbasaur', types: ['grass', 'poison'], sprite: 'url', cry: 'url' ... }
                    db.createObjectStore(STORE_POKEMON, { keyPath: 'id' });
                }
            }
        });
    }
    return dbPromise;
}

export async function savePokemonList(pokemonArray) {
    const db = await getDb();
    const tx = db.transaction(STORE_POKEMON, 'readwrite');
    const store = tx.objectStore(STORE_POKEMON);

    // Clear existing items first (in case of re-sync)
    await store.clear();

    for (const p of pokemonArray) {
        store.put(p);
    }

    await tx.done;
}

export async function getAllPokemon() {
    const db = await getDb();
    return await db.getAll(STORE_POKEMON);
}

export async function getPokemonById(id) {
    const db = await getDb();
    return await db.get(STORE_POKEMON, id);
}

export async function countPokemon() {
    const db = await getDb();
    return await db.count(STORE_POKEMON);
}
