const pokemonList = document.getElementById('pokemonList')
const loadMoreButton = document.getElementById('loadMoreButton')
const searchInput = document.getElementById('searchInput')
const autocompleteList = document.getElementById('autocompleteList')

const modal = document.getElementById('pokemonModal')
const modalBody = document.getElementById('modalBody')
const closeModalButton = document.getElementById('closeModal')

const maxRecords = 151
const limit = 10
let offset = 0

let pokemonNames = []

/* ---------- LISTAGEM ---------- */

function convertPokemonToLi(pokemon) {
    return `
        <li class="pokemon ${pokemon.type}"
            onclick="openPokemonModal('${pokemon.name}')">

            <span class="number">#${pokemon.number}</span>
            <span class="name">${pokemon.name}</span>

            <div class="detail">
                <ol class="types">
                    ${pokemon.types.map(type => `
                        <li class="type ${type}">${type}</li>
                    `).join('')}
                </ol>

                <img src="${pokemon.photo}" alt="${pokemon.name}">
            </div>
        </li>
    `
}

function loadPokemonItens(offset, limit) {
    pokeApi.getPokemons(offset, limit).then(pokemons => {
        pokemonList.innerHTML += pokemons.map(convertPokemonToLi).join('')
    })
}

loadPokemonItens(offset, limit)

loadMoreButton.addEventListener('click', () => {
    offset += limit

    if (offset + limit >= maxRecords) {
        loadPokemonItens(offset, maxRecords - offset)
        loadMoreButton.remove()
    } else {
        loadPokemonItens(offset, limit)
    }
})

/* ---------- AUTOCOMPLETE ---------- */

pokeApi.getPokemonNames().then(names => {
    pokemonNames = names
})

searchInput.addEventListener('input', () => {
    const value = searchInput.value.toLowerCase().trim()
    autocompleteList.innerHTML = ''

    if (value.length < 2) return

    pokemonNames
        .filter(name => name.startsWith(value))
        .slice(0, 5)
        .forEach(name => {
            const li = document.createElement('li')
            li.textContent = name
            li.onclick = () => {
                searchInput.value = name
                autocompleteList.innerHTML = ''
                searchPokemon(name)
            }
            autocompleteList.appendChild(li)
        })
})

/* ---------- BUSCA NO ENTER ---------- */

searchInput.addEventListener('keydown', event => {
    if (event.key === 'Enter') {
        const value = searchInput.value.toLowerCase().trim()
        autocompleteList.innerHTML = ''
        if (value) searchPokemon(value)
    }
})

function searchPokemon(name) {
    pokemonList.innerHTML = ''
    loadMoreButton.style.display = 'none'

    pokeApi.getPokemonByName(name)
        .then(pokemon => {
            pokemonList.innerHTML = convertPokemonToLi(pokemon)
        })
        .catch(() => {
            pokemonList.innerHTML = '<li class="not-found">Pokémon não encontrado</li>'
        })
}

/* ---------- MODAL ---------- */

window.openPokemonModal = function (name) {
    modal.className = 'modal' // limpa classes antigas
    modal.classList.remove('hidden')

    pokeApi.getPokemonDetails(name).then(pokemon => {
        const mainType = pokemon.types[0]

        modal.classList.add(mainType)

        modalBody.innerHTML = `
            <h2>${pokemon.name} (#${pokemon.number})</h2>
            <img src="${pokemon.photo}" alt="${pokemon.name}">
            <p><strong>Altura:</strong> ${pokemon.height} m</p>
            <p><strong>Peso:</strong> ${pokemon.weight} kg</p>
            <p><strong>Tipos:</strong> ${pokemon.types.join(', ')}</p>
            <p><strong>Habilidades:</strong> ${pokemon.abilities.join(', ')}</p>
        `
    })
}


closeModalButton.addEventListener('click', closeModal)

modal.addEventListener('click', event => {
    if (event.target === modal) closeModal()
})

function closeModal() {
    modal.classList.add('hidden')
}
