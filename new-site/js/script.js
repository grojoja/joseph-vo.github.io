// Toggle the dropdown menu
function toggleDropdown() {
    var dropdownMenu = document.getElementById("myDropdown");
    dropdownMenu.classList.toggle("show");
  }
  
  // Close the dropdown menu if the user clicks outside of it
  window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
      var dropdowns = document.getElementsByClassName("dropdown-content");
      for (var i = 0; i < dropdowns.length; i++) {
        var openDropdown = dropdowns[i];
        if (openDropdown.classList.contains('show')) {
          openDropdown.classList.remove('show');
        }
      }
    }
  }
  function toggleNightMode() {
    const body = document.body;
    body.classList.toggle('night-mode');
  
    // Save user's theme preference to local storage
    const theme = body.classList.contains('night-mode') ? 'night-mode' : '';
    var buttons = document.querySelectorAll('.dropbtn, .dropdown-content');
    buttons.forEach(function(button) {
      button.classList.toggle('nightmode')
    });
    localStorage.setItem('theme', theme);
  }
  
  // Function to initialize night mode based on user's preference
  function initializeNightMode() {
    const body = document.body;
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      body.classList.add(savedTheme);
    }
  }
  
  // Event listener for night mode toggle button
  document.addEventListener('DOMContentLoaded', function() {
    const nightModeToggle = document.getElementById('night-mode-toggle');
    if (nightModeToggle) {
      nightModeToggle.addEventListener('click', toggleNightMode);
    }
  
    initializeNightMode();
  });
  function toggleText() {
    var element = document.querySelector('.image-button');
    element.classList.toggle('expanded');
}
document.addEventListener('DOMContentLoaded', () => {
  const page1 = document.getElementById('page1');
  page1.addEventListener('click', () => {
      page1.classList.toggle('flipped');
      if (page1.classList.contains('flipped')) {
          page1.style.zIndex = 1;
          document.getElementById('page2').style.zIndex = 2;
      } else {
          page1.style.zIndex = 2;
          document.getElementById('page2').style.zIndex = 1;
      }
  });
});