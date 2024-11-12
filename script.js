require('dotenv').config(); // Load variables from .env

const API_KEY = process.env.YOUTUBE_API_KEY; // Access the API key
console.log(API_KEY); // Check if it's loaded properly

// Function to fetch music data from YouTube API
async function fetchMusic(query) {
    try {
        // Make an API request to your Express backend
        const response = await fetch(`https://ai-music-player.onrender.com/api/music?q=${encodeURIComponent(query)}`);
        const data = await response.json();
        return data || []; // Return items or an empty array
    } catch (error) {
        console.error('Error fetching music data:', error);
        return []; // Return an empty array on error
    }
}

const favorites = [];

function addToFavorites(video) {
    if (!favorites.some(fav => fav.id.videoId === video.id.videoId)) {
        favorites.push(video);
        displayFavorites();
    } else {
        alert('This video is already in your favorites.');
    }
}

function displayFavorites() {
    const favoritesContainer = document.getElementById('favorites-container');
    favoritesContainer.innerHTML = ''; // Clear previous favorites

    favorites.forEach(video => {
        const favoriteElement = document.createElement('div');
        favoriteElement.className = 'video-item';
        favoriteElement.innerHTML = `
            <h3>${video.snippet.title}</h3>
            <img src="${video.snippet.thumbnails.default.url}" alt="${video.snippet.title}">
            <button class="play-button" data-video-id="${video.id.videoId}">Play Video</button>
        `;
        favoritesContainer.appendChild(favoriteElement);
    });

    // Add play functionality for favorites
    const playButtons = favoritesContainer.querySelectorAll('.play-button');
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoId = this.dataset.videoId;
            playVideo(videoId);
        });
    });
}

function displayMusicResults(musicData) {
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = ''; // Clear previous results

    if (musicData.length === 0) {
        resultsContainer.innerHTML = '<p>No results found. Please try a different search.</p>';
        return;
    }

    musicData.forEach(video => {
        const videoElement = document.createElement('div');
        videoElement.className = 'video-item';
        videoElement.innerHTML = `
            <h3>${video.snippet.title}</h3>
            <img src="${video.snippet.thumbnails.default.url}" alt="${video.snippet.title}">
            <button class="play-button" data-video-id="${video.id.videoId}">Play Video</button>
            <button class="favorite-button" data-video='${JSON.stringify(video)}'>Add to Favorites</button>
        `;
        resultsContainer.appendChild(videoElement);
    });

    // Add event listeners for favorite buttons
    const favoriteButtons = resultsContainer.querySelectorAll('.favorite-button');
    favoriteButtons.forEach(button => {
        button.addEventListener('click', function() {
            const video = JSON.parse(this.dataset.video);
            addToFavorites(video);
        });
    });

    // Play buttons for search results
    const playButtons = resultsContainer.querySelectorAll('.play-button');
    playButtons.forEach(button => {
        button.addEventListener('click', function() {
            const videoId = this.dataset.videoId;
            playVideo(videoId);
        });
    });
}

// Function to play the video using YouTube IFrame API
function playVideo(videoId) {
    const playerContainer = document.getElementById('player-container');
    playerContainer.innerHTML = ''; // Clear previous player
    const iframe = document.createElement('iframe');
    iframe.width = '560';
    iframe.height = '315';
    iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
    iframe.frameBorder = '0';
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    iframe.allowFullscreen = true;
    playerContainer.appendChild(iframe);
}

// Event listener for the search button
document.getElementById('search-button').addEventListener('click', async () => {
    const query = document.getElementById('search-input').value;
    const resultsContainer = document.getElementById('results-container');
    resultsContainer.innerHTML = '<p>Loading...</p>'; // Show loading indicator

    const musicData = await fetchMusic(query);
    displayMusicResults(musicData); // Display the fetched music data
});

// Home button functionality
document.getElementById('home-button').addEventListener('click', function() {
    // Clear the search input
    document.getElementById('search-input').value = '';
    
    // Clear the results and favorites containers
    document.getElementById('results-container').innerHTML = '';
    document.getElementById('favorites-container').innerHTML = '';
    
    // Optionally, focus on the search input for easy searching
    document.getElementById('search-input').focus();
});
