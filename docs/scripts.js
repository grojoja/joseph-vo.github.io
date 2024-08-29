let currentIndex = 0;

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
