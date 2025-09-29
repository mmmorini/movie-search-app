const searchInput = document.querySelector(".buscador");
const mainContainer = document.querySelector("main");

const API_KEY = 'cbb2cc40';
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;

async function getMovies(searchItem) {
    try {
        const response = await fetch(`${API_URL}&s=${searchItem}`);
        const data = await response.json();

        if (data.Response === "True") {
            renderMovies(data.Search);
        } else {
            mainContainer.innerHTML = `<p class="msg-error">No se encontraron resultados para ${searchItem}</p>`;
        }

    } catch(error) {
        mainContainer.innerHTML = `<p class="msg-error">Ocurrión un error al buscar.Intenta de nuevo</p>`;
    }
}

function renderMovies(movies) {
    mainContainer.innerHTML = "";

    movies.forEach(movie => {
        const movieCard = document.createElement("div");
        movieCard.classList.add("peli");
    
        const poster = movie.Poster === "N/A" ? "https://via.placeholder.com/300x450?text=No+Poster" : movie.Poster;
    
        movieCard.innerHTML = `
            <div class="peli-poster">
                <img src="${poster}">
            </div>
            <div class="peli-info">
                <p class="peli-titulo">${movie.Title}</p>
                <p class="peli-año">${movie.Year}</p>
            </div>
        `;

        mainContainer.appendChild(movieCard);
    });
};

searchInput.addEventListener("input", (e)=> {
    const searchItem = e.target.value.trim();

    if (searchItem.length > 2) {
        getMovies(searchItem);
    }
});