
const pokeApi = {}

function convertPokeApiDetailToPokemon(pokeDetail) {
    const pokemon = new Pokemon()
    pokemon.number = pokeDetail.id
    pokemon.name = pokeDetail.name

    const types = pokeDetail.types.map((typeSlot) => typeSlot.type.name)
    const [type] = types

    pokemon.types = types
    pokemon.type = type

    pokemon.photo = pokeDetail.sprites.other.dream_world.front_default

    return pokemon
}

pokeApi.getPokemonDetail = (pokemon) => {
    return fetch(pokemon.url)
        .then((response) => response.json())
        .then(convertPokeApiDetailToPokemon)
}

pokeApi.getPokemons = (offset = 0, limit = 5) => {
    const url = `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`

    return fetch(url)
        .then((response) => response.json())
        .then((jsonBody) => jsonBody.results)
        .then((pokemons) => pokemons.map(pokeApi.getPokemonDetail))
        .then((detailRequests) => Promise.all(detailRequests))
        .then((pokemonsDetails) => pokemonsDetails)
}

pokeApi.getPokemonByName = (name) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Pokemon not found')
            }
            return response.json()
        })
        .then(pokemon => {
            return {
                number: pokemon.id,
                name: pokemon.name,
                type: pokemon.types[0].type.name,
                types: pokemon.types.map(t => t.type.name),
                photo: pokemon.sprites.other['official-artwork'].front_default
            }
        })
}

pokeApi.getPokemonNames = () => {
    const url = 'https://pokeapi.co/api/v2/pokemon?limit=151'

    return fetch(url)
        .then(response => response.json())
        .then(json => json.results.map(pokemon => pokemon.name))
}

pokeApi.getPokemonDetails = (idOrName) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${idOrName}`

    return fetch(url)
        .then(response => response.json())
        .then(pokemon => {
            return {
                number: pokemon.id,
                name: pokemon.name,
                types: pokemon.types.map(t => t.type.name),
                photo: pokemon.sprites.other['official-artwork'].front_default,
                height: pokemon.height / 10,
                weight: pokemon.weight / 10,
                abilities: pokemon.abilities.map(a => a.ability.name)
            }
        })
}
