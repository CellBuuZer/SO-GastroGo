const apiUrl = 'http://3.139.54.112:3000';

// DOM Elements
const addRestaurantForm = document.getElementById('addRestaurantForm');
const restaurantList = document.getElementById('restaurants');

// Fetch Restaurants
async function fetchRestaurants() {
    const response = await fetch(`${apiUrl}/restaurants`);
    const data = await response.json();
    displayRestaurants(data);
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

    const response = await fetch(`${apiUrl}/restaurants`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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

// Initial fetch of restaurants when page loads
fetchRestaurants();