// ------------ SELECCIÓN DE ELEMENTOS ------------

const searchInput = document.querySelector(".buscador");
const mainContainer = document.querySelector("main");
const notificationContainer = document.getElementById("notification-container");
const favoritesBtn = document.querySelector(".favorites-btn");

// ------------ VARIABLES ------------

const API_KEY = 'cbb2cc40';
const API_URL = `http://www.omdbapi.com/?apikey=${API_KEY}`;
let currentMovies = [];
let notificationTimer;

// ------------ FUNCIONES ------------

async function getMovies(searchItem) {
    try {
        const response = await fetch(`${API_URL}&s=${searchItem}`);
        const data = await response.json();

        if (data.Response === "True") {
            currentMovies = data.Search;
            renderMovies(currentMovies);
        } else {
            currentMovies = [];
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
                <button class="add-favorite-btn" data-movie-id="${movie.imdbID}">Añadir a Favoritos ⭐</button>
            </div>
        `;

        mainContainer.appendChild(movieCard);
    });
};

function showNotification(message, type) {
    clearTimeout(notificationTimer);

    notificationContainer.textContent = message;
    notificationContainer.className = "notification";
    notificationContainer.classList.add(type, "show");

    notificationTimer = setTimeout(() => {
        notificationContainer.classList.remove(type, "show");
    }, 3000);
};

function addFavorite(movieId) {
    const movieToAdd = currentMovies.find(movie => movie.imdbID === movieId);

    if (!movieToAdd) return;

    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    const isAlreadyFavorite = favorites.some(fav => fav.imdbID === movieId);

    if (isAlreadyFavorite) {
        showNotification(`Esta película ya está en favoritos`, "error");
        return;
    }

    favorites.push(movieToAdd);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    showNotification(`¡${movieToAdd.Title} añadida a favoritos!`, "success");
};

function renderFavorites() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    mainContainer.innerHTML = "";

    if (favorites.length === 0) {
        mainContainer.innerHTML = `<p class="info-msg">Tu lista de favoritos está vacía.</p>`;
        return;
    }

    favorites.forEach(movie => {
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
                <button class="add-favorite-btn" data-movie-id="${movie.imdbID}">Añadir a Favoritos ⭐</button>
            </div>
        `;

        mainContainer.appendChild(movieCard);
    });
}

// ------------ EVENTOS ------------

mainContainer.addEventListener("click", (e)=> {
    if (e.target.classList.contains("add-favorite-btn")) {
        const movieId = e.target.dataset.movieId;
        addFavorite(movieId);
    }
});

searchInput.addEventListener("input", (e)=> {
    const searchItem = e.target.value.trim();

    if (searchItem.length > 2) {
        getMovies(searchItem);
    }
});

favoritesBtn.addEventListener("click", () => {
    renderFavorites();
});