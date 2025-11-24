// SUA CHAVE DA API - Get yours from: https://openweathermap.org/api
const API_KEY = '';
const API_URL = 'https://api.openweathermap.org/data/2.5/weather';

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const weatherCard = document.getElementById('weather-card');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');

// Weather data elements
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherDescription = document.getElementById('weather-description');
const weatherIcon = document.getElementById('weather-icon');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const tempMin = document.getElementById('temp-min');
const tempMax = document.getElementById('temp-max');

// Get weather data
async function getWeather(city) {
    try {
        showLoading();
        hideError();
        hideWeatherCard();

        const response = await fetch(
            `${API_URL}?q=${city}&appid=${API_KEY}&units=metric&lang=en`
        );

        if (!response.ok) {
            throw new Error('City not found');
        }

        const data = await response.json();
        displayWeather(data);
        
    } catch (error) {
        showError();
        console.error('Error fetching weather data:', error);
    } finally {
        hideLoading();
    }
}

// Display weather data
function displayWeather(data) {
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    weatherDescription.textContent = data.weather[0].description;
    
    // Weather icon
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    weatherIcon.alt = data.weather[0].description;

    // Additional details
    humidity.textContent = `${data.main.humidity}%`;
    windSpeed.textContent = `${data.wind.speed} km/h`;
    tempMin.textContent = `${Math.round(data.main.temp_min)}°C`;
    tempMax.textContent = `${Math.round(data.main.temp_max)}°C`;

    // Show weather card
    showWeatherCard();
}

// UI Helper functions
function showLoading() {
    loading.style.display = 'block';
}

function hideLoading() {
    loading.style.display = 'none';
}

function showError() {
    errorMessage.style.display = 'block';
}

function hideError() {
    errorMessage.style.display = 'none';
}

function showWeatherCard() {
    weatherCard.classList.add('active');
}

function hideWeatherCard() {
    weatherCard.classList.remove('active');
}

// Event Listeners
searchBtn.addEventListener('click', handleSearch);
cityInput.addEventListener('keypress', handleEnterKey);

function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
}

function handleEnterKey(e) {
    if (e.key === 'Enter') {
        handleSearch();
    }
}

// Optional: Get weather by geolocation
function getWeatherByCoords(lat, lon) {
    fetch(`${API_URL}?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric&lang=en`)
        .then(response => response.json())
        .then(data => displayWeather(data))
        .catch(error => {
            showError();
            console.error('Error:', error);
        });
}

// Uncomment to enable geolocation feature
/*
if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            getWeatherByCoords(latitude, longitude);
        },
        (error) => {
            console.log('Geolocation not allowed or not available');
        }
    );
}
*/

// Demo data for testing (remove in production)
function showDemoData() {
    const demoData = {
        name: "London",
        sys: { country: "GB" },
        main: {
            temp: 15,
            humidity: 65,
            temp_min: 12,
            temp_max: 18
        },
        weather: [{
            description: "cloudy",
            icon: "03d"
        }],
        wind: { speed: 5.2 }
    };
    displayWeather(demoData);
}

// Uncomment next line to show demo data on load (for testing without API key)
// showDemoData();