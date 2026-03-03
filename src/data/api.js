import { savePokemonList, countPokemon, getAllPokemon as getAllPokemonFromDb, getPokemonById, clearPokedex } from './db.js';
import { getLanguage } from '../i18n.js';

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
      pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_in: [7, 9]}}) {
        flavor_text
        language_id
      }
      pokemon_v2_pokemonspeciesnames(where: {language_id: {_in: [7, 9]}}) {
        name
        language_id
      }
    }
  }
}
`;

export async function loadData(onProgress) {
  try {
    const cachedCount = await countPokemon();
    if (cachedCount >= TOTAL_POKEMON) {
      const sample = await getPokemonById(1);
      // Ensure we have correct capitalized/translated names or we clear DB
      if (sample && sample.generationId !== undefined && sample.names !== undefined && sample.names.es) {
        onProgress(100, 'Datos cargados desde la caché.');
        return;
      } else {
        await clearPokedex();
      }
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

      const namesData = spec.pokemon_v2_pokemonspeciesnames || [];
      const defaultName = p.name.charAt(0).toUpperCase() + p.name.slice(1).replace('-', ' ');

      const names = {
        es: defaultName,
        en: defaultName
      };

      namesData.forEach(n => {
        if (n.language_id === 7) names.es = n.name;
        if (n.language_id === 9) names.en = n.name;
      });

      const flavorTextsData = spec.pokemon_v2_pokemonspeciesflavortexts || [];
      const descriptions = {
        es: 'Sin descripción disponible.',
        en: 'No description available.'
      };

      flavorTextsData.forEach(f => {
        let desc = f.flavor_text.replace(/[\n\f\r]/g, ' ');
        if (f.language_id === 7) descriptions.es = desc;
        if (f.language_id === 9) descriptions.en = desc;
      });

      return {
        id: p.id,
        names: names,
        descriptions: descriptions,
        evoChainId: spec.evolution_chain_id || null,
        generationId: spec.generation_id || 1,
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

export async function getAllPokemon() {
  const list = await getAllPokemonFromDb();
  const lang = getLanguage();
  return list.map(p => ({
    ...p,
    name: p.names ? p.names[lang] : p.name,
    description: p.descriptions ? p.descriptions[lang] : p.description
  }));
}

export async function getRandomPokemon(count = 4, filterFn = null) {
  const list = await getAllPokemon();
  const filtered = filterFn ? list.filter(filterFn) : list;

  // Shuffle and pick
  const shuffled = [...filtered].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}
