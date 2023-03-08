const moviesContainer = document.querySelector('.movies-container');
const btnPrev = document.querySelector('.btn-prev');
const btnNext = document.querySelector('.btn-next');
const input = document.querySelector('.input');
const highlightVideo = document.querySelector('.highlight__video');
const highlightTitle = document.querySelector('.highlight__title');
const highlightRating = document.querySelector('.highlight__rating');
const highlightGenres = document.querySelector('.highlight__genres');
const highlightLaunch = document.querySelector('.highlight__launch');
const highlightDescription = document.querySelector('.highlight__description');
const highlightVideoLink = document.querySelector('.highlight__video-link');
const modal = document.querySelector('.modal');
const modalBody = modal.querySelector('.modal__body');
const modalTitle = document.querySelector('.modal__title');
const modalImg = document.querySelector('.modal__img');
const modalDescription = document.querySelector('.modal__description');
const modalAverage = document.querySelector('.modal__average');
const modalGenres = document.querySelector('.modal__genres');
const btnTheme = document.querySelector('.btn-theme');
const root = document.querySelector(':root');
const logo = document.querySelector('header img');
const modalClose = document.querySelector('.modal__close');

let films;
let filmPagination = 0;

const loadFilms = async () => {
    const response = await api.get('/3/discover/movie?language=pt-BR&include_adult=false');
    films = response.data.results;

    fillPoster(films);

}

const searchFilm = async (name) => {
    const response = await api.get(`/3/search/movie?language=pt-BR&include_adult=false&query=${name}`);
    films = response.data.results
    fillPoster(films);

}

const fillPoster = (films) => {

    clearMovies();

    for (let i = filmPagination; i < filmPagination + 6; i++) {
        const div = document.createElement('div');
        div.classList.add('movie');
        div.style.backgroundImage = `url("${films[i].poster_path}")`;

        const id = document.createElement('span');
        id.classList.add('filmId');
        id.classList.add('hidden');
        id.textContent = films[i].id;

        const divInfo = document.createElement('div');
        divInfo.classList.add('movie__info');

        const spanTitle = document.createElement('span');
        spanTitle.classList.add('movie__title')
        spanTitle.textContent = films[i].title;

        const spanRating = document.createElement('span');
        spanRating.classList.add('movie__rating')
        spanRating.textContent = films[i].vote_average;

        const starImg = document.createElement('img');
        starImg.srcset = './assets/estrela.svg';
        starImg.alt = 'Estrela';

        divInfo.appendChild(spanTitle);
        divInfo.appendChild(spanRating);
        spanRating.appendChild(starImg);
        div.appendChild(id);
        div.appendChild(divInfo);
        moviesContainer.appendChild(div);
    }

    modalEventListener();
}

const clearMovies = () => {
    const movies = moviesContainer.querySelectorAll('.movie');
    movies.forEach((movie) => {
        moviesContainer.removeChild(movie);
    });
};

const filmOfTheDay = async () => {
    const result = await api.get('/3/movie/436969?language=pt-BR');
    highlightVideo.style.backgroundImage = `url('${result.data.backdrop_path}')`;
    highlightVideo.style.backgroundSize = 'contain';
    highlightTitle.textContent = result.data.title;
    highlightRating.textContent = result.data.vote_average.toFixed(1);
    let genres;
    result.data.genres.forEach((genre) => {
        if (genres) {
            genres += ', ' + genre.name;
        } else {
            genres = genre.name;
        }
    })
    highlightGenres.textContent = genres;
    highlightLaunch.textContent = new Date(result.data.release_date).toLocaleDateString("pt-BR", {
        year: "numeric",
        month: "long",
        day: "numeric",
        timeZone: "UTC",
    });
    highlightDescription.textContent = result.data.overview;

    const videoResult = await api.get('/3/movie/436969/videos?language=pt-BR');
    highlightVideoLink.href = `https://www.youtube.com/watch?v=${videoResult.data.results[0].key}`;

}

const modalEventListener = () => {
    const movies = moviesContainer.querySelectorAll('.movie')
    movies.forEach((movie) => {
        movie.addEventListener('click', async (event) => {
            const id = movie.querySelector('.filmId')
            try {
                const response = await api.get(`/3/movie/${id.textContent}?language=pt-BR`)
                modalTitle.textContent = response.data.title;
                modalImg.srcset = response.data.backdrop_path;
                modalDescription.textContent = response.data.overview;
                modalAverage.textContent = response.data.vote_average.toFixed(1);

                clearModalGenre();
                response.data.genres.forEach((genre) => {
                    const span = document.createElement('span');
                    span.classList.add('modal__genre');
                    span.textContent = genre.name;
                    modalGenres.appendChild(span);
                })
            } catch { }
            modal.classList.remove('hidden');
        })
    })
}

const clearModalGenre = () => {
    const genres = modalGenres.querySelectorAll('span')
    genres.forEach((genre) => {
        modalGenres.removeChild(genre);
    })
}

btnPrev.addEventListener('click', () => {
    if (filmPagination == 0) {
        filmPagination = 12;
        fillPoster(films);
    } else if (filmPagination == 6) {
        filmPagination = 0;
        fillPoster(films);
    } else {
        filmPagination = 6;
        fillPoster(films);
    };
});

btnNext.addEventListener('click', () => {

    if (filmPagination == 0) {
        filmPagination = 6;
        fillPoster(films);
    } else if (filmPagination == 6) {
        filmPagination = 12;
        fillPoster(films);
    } else {
        filmPagination = 0;
        fillPoster(films);
    };
});

input.onfocus = input.addEventListener('keyup', (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (event.key == 'Enter') {
        filmPagination = 0;
        if (input.value == '') {

            loadFilms();
        } else {
            searchFilm(input.value);
            input.value = '';
        }
    }
})

modalBody.addEventListener('click', (event) => {
    modal.classList.add('hidden');
})

const themeLight = () => {
    btnTheme.srcset = './assets/light-mode.svg';
    logo.srcset = './assets/logo-dark.png';
    btnNext.srcset = './assets/arrow-right-dark.svg';
    btnPrev.srcset = './assets/arrow-left-dark.svg';
    modalClose.srcset = './assets/close-dark.svg'
    root.style.setProperty('--background', '#FFF');
    root.style.setProperty('--text-color', '#1b2028');
    root.style.setProperty('--bg-secondary', '#ededed');
    localStorage.setItem('theme', 'light');
}

const themeDark = () => {
    btnTheme.srcset = './assets/dark-mode.svg';
    logo.srcset = './assets/logo.svg';
    btnNext.srcset = './assets/arrow-right-light.svg';
    btnPrev.srcset = './assets/arrow-left-light.svg';
    modalClose.srcset = './assets/close.svg'
    root.style.setProperty('--background', '#1B2028');
    root.style.setProperty('--text-color', '#FFF');
    root.style.setProperty('--bg-secondary', '#2D3440');
    localStorage.setItem('theme', 'dark');
}

if (!localStorage.getItem('theme') || localStorage.getItem('theme') == 'light') {
    themeLight();
} else {
    themeDark();
}

btnTheme.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (localStorage.getItem('theme') == 'light') {
        themeDark();
    } else {
        themeLight();
    }
});


loadFilms();
filmOfTheDay();



