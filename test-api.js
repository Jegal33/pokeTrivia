const QUERY = `query { pokemon_v2_pokemon(limit: 5) { name pokemon_v2_pokemonspecy { pokemon_v2_pokemonspeciesflavortexts(where: {language_id: {_eq: 7}}, limit: 1) { flavor_text } } } }`;

fetch('https://beta.pokeapi.co/graphql/v1beta', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query: QUERY })
})
    .then(r => r.json())
    .then(data => console.log(JSON.stringify(data, null, 2)))
    .catch(console.error);
