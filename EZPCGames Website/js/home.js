// Step 1: Get DOM elements
const nextDom = document.getElementById('next');
const prevDom = document.getElementById('prev');
const carouselDom = document.querySelector('.carousel');
const sliderDom = carouselDom.querySelector('.carousel .list');
const thumbnailBorderDom = document.querySelector('.carousel .thumbnail');
const thumbnailItemsDom = thumbnailBorderDom.querySelectorAll('.item');
const timeDom = document.querySelector('.carousel .time');

// Initialize variables
const timeRunning = 3000; // Time for each transition (in ms)
const timeAutoNext = 7000; // Time between auto transitions (in ms)
const timeAutoAboutUs = 9000; // Time for auto-slide in About Us carousel (in ms)

let runNextAuto = setTimeout(() => {
    nextDom.click();
}, timeAutoNext); // Auto slide function for next slide

// Manual navigation handlers for next and prev buttons
nextDom.onclick = function () {
    showSlider('next');
};

prevDom.onclick = function () {
    showSlider('prev');
};

let runTimeOut;

// Show slider function for controlling the transition
function showSlider(type) {
    const sliderItemsDom = sliderDom.querySelectorAll('.carousel .list .item');
    const thumbnailItemsDom = document.querySelectorAll('.carousel .thumbnail .item');

    // Handle 'next' and 'prev' types for the carousel
    if (type === 'next') {
        sliderDom.appendChild(sliderItemsDom[0]); // Move the first item to the end
        thumbnailBorderDom.appendChild(thumbnailItemsDom[0]); // Move the first thumbnail to the end
        carouselDom.classList.add('next'); // Add transition class for effect
    } else {
        sliderDom.prepend(sliderItemsDom[sliderItemsDom.length - 1]); // Move the last item to the start
        thumbnailBorderDom.prepend(thumbnailItemsDom[thumbnailItemsDom.length - 1]); // Move the last thumbnail to the start
        carouselDom.classList.add('prev'); // Add transition class for effect
    }

    // Clear previous timeout for transition
    clearTimeout(runTimeOut);
    runTimeOut = setTimeout(() => {
        carouselDom.classList.remove('next'); // Remove transition class after the animation ends
        carouselDom.classList.remove('prev');
    }, timeRunning);

    // Restart the auto slide timeout
    clearTimeout(runNextAuto);
    runNextAuto = setTimeout(() => {
        nextDom.click(); // Trigger the next slide after a delay
    }, timeAutoNext);
}

document.addEventListener('DOMContentLoaded', function () {
    // Get buttons for next and prev actions
    const next = document.querySelector('.about-us-next');
    const prev = document.querySelector('.about-us-prev');
    const aboutUsSlide = document.querySelector('.about-us-slide');

    // Preserve scroll position function
    function preserveScroll(callback) {
        const scrollX = window.scrollX;
        const scrollY = window.scrollY;

        // Perform the callback without letting the browser adjust scroll
        callback();

        // Restore scroll position
        window.scrollTo(scrollX, scrollY);
    }

    // Manual control for about-us carousel
    next.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent any default action that might cause scrolling
        const items = document.querySelectorAll('.about-us-item');

        // Preserve scroll while appending first item to the end
        preserveScroll(() => {
            aboutUsSlide.appendChild(items[0]);
        });
    });

    prev.addEventListener('click', function (e) {
        e.preventDefault(); // Prevent default scrolling behavior
        const items = document.querySelectorAll('.about-us-item');

        // Preserve scroll while prepending last item to the beginning
        preserveScroll(() => {
            aboutUsSlide.prepend(items[items.length - 1]);
        });
    });

    // Auto-slide logic
    const timeAutoAboutUs = 4500;
    setInterval(() => {
        const items = document.querySelectorAll('.about-us-item');

        // Preserve scroll during auto-slide transition
        preserveScroll(() => {
            aboutUsSlide.appendChild(items[0]);
        });
    }, timeAutoAboutUs);
});

// GAMES CARD START

let gamesData = [];
let currentPage = 1;
const gamesPerPage = 6;  // Set how many games to display per page

// Fetch games data from JSON
async function fetchGames() {
    try {
        const response = await fetch('assets/homegames.json');
        const data = await response.json();
        gamesData = data.games;
        displayGames(gamesData);  // Display the initial games list
        setupPagination(gamesData);  // Setup pagination for the full list
    } catch (error) {
        console.error('Error fetching games data:', error);
    }
}

// Function to display games
function displayGames(games) {
    const gamesList = document.getElementById('games-list');
    gamesList.innerHTML = ''; // Clear any existing content

    const startIndex = (currentPage - 1) * gamesPerPage;
    const endIndex = startIndex + gamesPerPage;
    const gamesToDisplay = games.slice(startIndex, endIndex);

    gamesToDisplay.forEach(game => {
        const card = document.createElement('div');
        card.className = 'game-card';

        card.innerHTML = `
            <img src="${game.image}" alt="${game.name}" class="game-image">
            <div class="game-info">
                <h3>${game.name}</h3>
                <p><strong>Size:</strong> ${game.size} GB</p>
                ${game.price ? `<p><strong>Price:</strong> $${game.price}</p>` : ''}
                ${game.info ? `<p><strong>Info:</strong> ${game.info}</p>` : ''}
                ${game.fyi ? `<p><strong>FYI:</strong> ${game.fyi}</p>` : ''}
            </div>
        `;
        gamesList.appendChild(card);
    });
}

// SEARCH BAR START
document.getElementById('search').addEventListener('input', function(event) {
    const searchQuery = event.target.value.toLowerCase();
    const filteredGames = gamesData.filter(game => game.name.toLowerCase().includes(searchQuery));

    // Update games display and pagination with filtered data
    currentPage = 1; // Reset page to 1 when search is triggered
    displayGames(filteredGames);
    setupPagination(filteredGames);  // Update pagination with filtered games
});
// SEARCH BAR END

// PAGINATION START

function setupPagination(games) {
    const paginationContainer = document.getElementById('pagination-container');
    paginationContainer.innerHTML = '';  // Clear existing pagination buttons

    const totalPages = Math.ceil(games.length / gamesPerPage);

    // Create pagination buttons
    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.innerText = i;
        button.className = 'pagination-button';
        button.onclick = () => changePage(i, games);
        paginationContainer.appendChild(button);
    }
}

// Change page function for pagination
function changePage(pageNumber, games) {
    currentPage = pageNumber;
    displayGames(games);

    // Highlight the active pagination button
    const buttons = document.querySelectorAll('#pagination-container button');
    buttons.forEach(button => button.classList.remove('active'));
    const activeButton = document.querySelector(`#pagination-container button:nth-child(${pageNumber})`);
    activeButton.classList.add('active');
}

// PAGINATION END

// Initialize the page with the games data
fetchGames();
