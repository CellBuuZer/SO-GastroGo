const apiUrl = 'http://3.139.54.112:3000';

// DOM Elements
const loginSection = document.getElementById('loginSection');
const dashboard = document.getElementById('dashboard');
const logoutButton = document.getElementById('logoutButton');
const addRestaurantForm = document.getElementById('addRestaurantForm');
const restaurantList = document.getElementById('restaurants');

// Login Form Submission
const loginUserForm = document.getElementById('loginUserForm');
loginUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const loginError = document.getElementById('loginError');

    // Validation
    if (!email.includes('@') || !email.includes('.')) {
        loginError.textContent = 'Invalid email format!';
        return;
    }

    loginError.textContent = '';

    const credentials = { email, password };

    // Send login request to /login endpoint
    const response = await fetch(`${apiUrl}/login`, {  // Change here from /users to /login
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
    });

    if (response.ok) {
        const data = await response.json();  // Get the response data which contains the token

        // Store the token in localStorage (or sessionStorage for session-specific)
        localStorage.setItem('token', data.token);

        alert('Login successful!');

        // Hide login section and show dashboard
        loginSection.style.display = 'none';
        dashboard.style.display = 'block';

        // Fetch restaurants after login
        fetchRestaurants();
    } else {
        loginError.textContent = 'Login failed! Please check your email and password.';
    }
});

// Logout Button
logoutButton.addEventListener('click', () => {
    alert('Logged out successfully!');
    localStorage.removeItem('token');  // Remove token on logout
    dashboard.style.display = 'none';
    loginSection.style.display = 'block';
});

// Fetch Restaurants
async function fetchRestaurants() {
    const token = localStorage.getItem('token');  // Get the stored token
    if (!token) {
        alert('You need to login first!');
        return;
    }

    // Send authenticated request to fetch restaurants
    const response = await fetch(`${apiUrl}/restaurants`, {
        headers: {
            'Authorization': `Bearer ${token}`  // Include token in the Authorization header
        }
    });

    if (response.ok) {
        const data = await response.json();
        displayRestaurants(data);
    } else {
        alert('Failed to fetch restaurants.');
    }
}

// Display Restaurants
function displayRestaurants(restaurants) {
    restaurantList.innerHTML = '';
    restaurants.forEach(restaurant => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${restaurant.name}</strong><br>
            Address: ${restaurant.address}<br>
            Phone: ${restaurant.phone}<br>
            Email: ${restaurant.email}<br>
            Cuisine: ${restaurant.cuisine}<br>
            Rating: ${restaurant.rating}<br>
        `;
        restaurantList.appendChild(li);
    });
}

// Add Restaurant
addRestaurantForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const newRestaurant = {
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        cuisine: document.getElementById('cuisine').value,
        rating: document.getElementById('rating').value,
    };

    const token = localStorage.getItem('token');
    if (!token) {
        alert('You must be logged in to add a restaurant.');
        return;
    }

    const response = await fetch(`${apiUrl}/restaurants`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`  // Include the token
        },
        body: JSON.stringify(newRestaurant)
    });

    if (response.ok) {
        alert('Restaurant added!');
        fetchRestaurants(); // Refresh the list
    } else {
        alert('Failed to add restaurant');
    }
});

// Initial fetch of restaurants when dashboard is loaded
// This won't trigger until the user logs in
