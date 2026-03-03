import { savePokemonList, countPokemon, getAllPokemon } from './db.js';

const TOTAL_POKEMON = 1025; // Up to Gen 9
const GRAPHQL_URL = 'https://beta.pokeapi.co/graphql/v1beta';

const QUERY = `
query GetMinimalPokemonData {
  pokemon_v2_pokemon(limit: 1025, order_by: {id: asc}) {
    id
    name
    pokemon_v2_pokemontypes {
      pokemon_v2_type {
        name
      }
    }
    pokemon_v2_pokemonspecy {
      evolution_chain_id
      generation_id
    }
  }
}
`;

export async function loadData(onProgress) {
  try {
    const cachedCount = await countPokemon();
    if (cachedCount >= TOTAL_POKEMON) {
      onProgress(100, 'Datos cargados desde la caché.');
      return;
    }

    onProgress(10, 'Conectando con la Pokédex Nacional...');

    // Using GraphQL to fetch everything in one payload (~100-200kb total)
    const response = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: QUERY })
    });

    if (!response.ok) throw new Error('Network response was not ok');

    onProgress(50, 'Procesando datos Pokémon...');

    const { data } = await response.json();
    const rawList = data.pokemon_v2_pokemon;

    const formattedList = rawList.map(p => {
      const spec = p.pokemon_v2_pokemonspecy || {};
      return {
        id: p.id,
        name: p.name,
        evoChainId: spec.evolution_chain_id || null,
        types: p.pokemon_v2_pokemontypes.map(pt => pt.pokemon_v2_type.name),
        sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${p.id}.png`,
        cry: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${p.id}.ogg`
      };
    });

    onProgress(80, 'Guardando datos en la Pokédex...');
    await savePokemonList(formattedList);

    onProgress(100, '¡Pokédex lista!');

    // Small delay so user sees 100%
    await new Promise(r => setTimeout(r, 500));

  } catch (error) {
    console.error("Failed to load data from PokeAPI", error);
    throw error;
  }
}

export { getAllPokemon } from './db.js';

export async function getRandomPokemon(count = 4, filterFn = null) {
  const list = await getAllPokemon();
  const filtered = filterFn ? list.filter(filterFn) : list;

  // Shuffle and pick
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
