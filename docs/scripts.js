let currentIndex = 0;

// Function to fetch the currently playing track from your server
async function fetchTrackInfo() {
    try {
        // Fetch data from your Node.js server
        const response = await fetch('https://website-for-me-6626ff31f90f.herokuapp.com/currently-playing'); // Replace with your server's URL if deployed
        const data = await response.json();

        // Check if there's a track playing and display it
        if (data.track) {
            displayTrack(data);
        } else {
            document.getElementById('track-info').innerText = data.message || 'No track currently playing.';
        }
    } catch (error) {
        console.error('Error fetching track data:', error);
        document.getElementById('track-info').innerText = 'Error loading track information.';
    }
}

// Function to display the track info
function displayTrack(data) {
    const trackName = data.track;
    const artistName = data.artist;
    const albumArt = data.albumArt;

    document.getElementById('track-info').innerHTML = `
        <img src="${albumArt}" alt="Album Art" style="width: 100px;">
        <p><strong>${trackName}</strong> by ${artistName}</p>
    `;
}

// Call the function when the page loads
window.onload = fetchTrackInfo;



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

  if (theme === 'dark') {
    body.classList.add('dark-mode');
    themeIcon.src = 'moon.png'; // Replace with the path to your moon icon
    themeIcon.alt = 'Switch to light mode';
  } else {
    themeIcon.src = 'sun.png'; // Replace with the path to your sun icon
    themeIcon.alt = 'Switch to dark mode';
  }
});
