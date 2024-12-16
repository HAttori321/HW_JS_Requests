const apiKey = 'c7079d3';
        let currentPage = 1;
        let currentQuery = '';

        function searchMovies(page = 1) {
            const title = document.getElementById('title').value;
            const type = document.getElementById('type').value;

            if (!title) {
                alert('Please enter a title.');
                return;
            }

            currentQuery = `http://www.omdbapi.com/?apikey=${apiKey}&s=${title}&type=${type}&page=${page}`;
            currentPage = page;

            fetchMovies(currentQuery);
        }

        function fetchMovies(query) {
            fetch(query)
                .then(response => response.json())
                .then(data => {
                    if (data.Response === 'True') {
                        displayMovies(data.Search);
                        setupPagination(data.totalResults);
                    } else {
                        document.getElementById('film-container').innerHTML = '<p>Movie not found!</p>';
                        document.getElementById('pagination').innerHTML = '';
                    }
                });
        }

        function displayMovies(movies) {
            const container = document.getElementById('film-container');
            container.innerHTML = movies.map(movie => `
                <div class="film">
                    <img src="${movie.Poster !== 'N/A' ? movie.Poster : 'placeholder.jpg'}" alt="${movie.Title}">
                    <h4>${movie.Title}</h4>
                    <p>${movie.Year}</p>
                    <button onclick="fetchDetails('${movie.imdbID}')">Details</button>
                </div>
            `).join('');
        }

        function setupPagination(totalResults) {
            const totalPages = Math.ceil(totalResults / 10);
            const pagination = document.getElementById('pagination');
            pagination.innerHTML = '';

            for (let i = 1; i <= totalPages && i <= 5; i++) {
                pagination.innerHTML += `<button onclick="searchMovies(${i})">${i}</button>`;
            }
        }

        function fetchDetails(imdbID) {
            const detailsQuery = `http://www.omdbapi.com/?apikey=${apiKey}&i=${imdbID}`;
            fetch(detailsQuery)
                .then(response => response.json())
                .then(data => {
                    displayDetails(data);
                });
        }

        function displayDetails(details) {
            const container = document.getElementById('details-container');
            container.innerHTML = `
                <h2>${details.Title}</h2>
                <p><strong>Released:</strong> ${details.Released}</p>
                <p><strong>Genre:</strong> ${details.Genre}</p>
                <p><strong>Director:</strong> ${details.Director}</p>
                <p><strong>Actors:</strong> ${details.Actors}</p>
                <p><strong>Awards:</strong> ${details.Awards}</p>
                <img src="${details.Poster !== 'N/A' ? details.Poster : 'placeholder.jpg'}" alt="${details.Title}">
            `;
        }