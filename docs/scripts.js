let currentIndex = 0;
const apiURL = 'https://website-for-me-6626ff31f90f.herokuapp.com/currently-playing';  // Your Heroku app URL

// Function to fetch the currently playing track from your server
async function fetchTrackInfo() {
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        updateTrackInfo(data);  // Call function to update the DOM with track info
    } catch (error) {
        console.error('Error fetching track info:', error);
        hideTrackInfo();  // If there's an error, hide the track info
    }
}

// Function to update the track info on the page
function updateTrackInfo(trackData) {
    const trackInfoDiv = document.getElementById('track-info');

    if (trackData && trackData.is_playing) {
        const trackName = trackData.item.name;
        const artistName = trackData.item.artists.map(artist => artist.name).join(', ');
        const albumArt = trackData.item.album.images[0].url;
        const progress = trackData.progress_ms;
        const duration = trackData.item.duration_ms;

        // Display the track info
        trackInfoDiv.innerHTML = `
            <img src="${albumArt}" alt="Album Art" style="width: 100px; height: 100px;">
            <p><strong>${trackName}</strong> by ${artistName}</p>
            <p>Progress: ${formatTime(progress)} / ${formatTime(duration)}</p>
        `;

        trackInfoDiv.style.display = 'block';  // Ensure the track info is visible
    } else {
        hideTrackInfo();  // Hide the track info if nothing is playing
    }
}

// Function to hide the track info
function hideTrackInfo() {
    const trackInfoDiv = document.getElementById('track-info');
    trackInfoDiv.style.display = 'none';  // Hide the track info when nothing is playing
}

// Helper function to format time (in mm:ss format)
function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = ((ms % 60000) / 1000).toFixed(0);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

// Poll the currently playing track info every 5 seconds
setInterval(fetchTrackInfo, 5000);

// Initial fetch when the page loads
window.onload = fetchTrackInfo;


// Carousel functionality
function moveCarousel(direction) {
    const carousel = document.getElementById('carousel-images');
    const images = carousel.querySelectorAll('img');
    const totalImages = images.length;
    currentIndex += direction;

    if (currentIndex < 0) {
        currentIndex = totalImages - 1;
    } else if (currentIndex >= totalImages) {
        currentIndex = 0;
    }

    const imageWidth = carousel.clientWidth; // Use the container's width to adjust the carousel
    const offset = -currentIndex * imageWidth;
    carousel.style.transform = `translateX(${offset}px)`;
}

// Theme toggle functionality
function toggleTheme() {
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');
    const isDarkMode = body.classList.toggle('dark-mode');

    // Change the icon based on the current theme
    if (isDarkMode) {
        themeIcon.src = 'moon.png'; // Replace with the path to your moon icon
        themeIcon.alt = 'Switch to light mode';
    } else {
        themeIcon.src = 'sun.png'; // Replace with the path to your sun icon
        themeIcon.alt = 'Switch to dark mode';
    }

    // Save the user's theme preference
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
}

// Initialize theme based on previous preference
document.addEventListener('DOMContentLoaded', () => {
    const theme = localStorage.getItem('theme');
    const body = document.body;
    const themeIcon = document.getElementById('theme-icon');

    // Set the initial theme based on saved preference
    if (theme === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.src = 'moon.png'; // Replace with the path to your moon icon
        themeIcon.alt = 'Switch to light mode';
    } else {
        themeIcon.src = 'sun.png'; // Replace with the path to your sun icon
        themeIcon.alt = 'Switch to dark mode';
    }
});
