function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
  
    const correctUsername = 'admin';
    const correctPassword = 'password';
  
    if (username === correctUsername && password === correctPassword) {
      localStorage.setItem('loggedIn', true); // Set login flag in local storage
      window.location.href = 'landingpage.html'; // Redirect to the main page
    } else {
      alert('Invalid username or password');
    }
  }
  