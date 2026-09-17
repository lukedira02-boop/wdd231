const WEATHER_API_KEY = 'YOUR_OPENWEATHERMAP_API_KEY';
const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=0.3136&lon=32.5811&units=metric&appid=${WEATHER_API_KEY}`;
const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=0.3136&lon=32.5811&units=metric&appid=${WEATHER_API_KEY}`;
const membershipNames = { 2: 'Silver member', 3: 'Gold member' };

const currentYear = document.querySelector('#currentyear');
const lastModified = document.querySelector('#lastModified');
const spotlights = document.querySelector('#spotlights');
const currentTemperature = document.querySelector('#current-temperature');
const weatherDescription = document.querySelector('#weather-description');
const forecast = document.querySelector('#forecast');

function formatDay(date) {
  return new Intl.DateTimeFormat('en-US', { weekday: 'short' }).format(date);
}

function renderForecast(items) {
  const days = items.filter((item) => item.dt_txt.includes('12:00:00')).slice(0, 3);
  forecast.innerHTML = days.map((item) => `<div class="forecast-day"><p>${formatDay(new Date(item.dt * 1000))}</p><strong>${Math.round(item.main.temp)}°C</strong><p>${item.weather[0].description}</p></div>`).join('');
}

async function loadWeather() {
  if (WEATHER_API_KEY === 'YOUR_OPENWEATHERMAP_API_KEY') {
    currentTemperature.textContent = '24°C';
    weatherDescription.textContent = 'Add an OpenWeatherMap key for live conditions';
    forecast.innerHTML = ['Today', 'Tomorrow', 'Saturday'].map((day, index) => `<div class="forecast-day"><p>${day}</p><strong>${[24, 25, 23][index]}°C</strong><p>Kampala outlook</p></div>`).join('');
    return;
  }
  try {
    const [currentResponse, forecastResponse] = await Promise.all([fetch(weatherUrl), fetch(forecastUrl)]);
    if (!currentResponse.ok || !forecastResponse.ok) throw new Error('Weather request failed');
    const current = await currentResponse.json();
    const forecastData = await forecastResponse.json();
    currentTemperature.textContent = `${Math.round(current.main.temp)}°C`;
    weatherDescription.textContent = current.weather[0].description;
    renderForecast(forecastData.list);
  } catch (error) {
    currentTemperature.textContent = 'Weather unavailable';
    weatherDescription.textContent = 'Please check back soon.';
    console.error(error);
  }
}

function spotlightCard(member) {
  return `<article class="spotlight-card"><img src="images/${member.image}" alt="${member.name} logo" width="240" height="180" loading="lazy"><div class="spotlight-content"><p class="membership membership-${member.membershipLevel}">${membershipNames[member.membershipLevel]}</p><h3>${member.name}</h3><p>${member.address}<br>${member.phone}</p><a href="${member.website}" target="_blank" rel="noopener">Visit website <span aria-hidden="true">↗</span></a></div></article>`;
}

async function loadSpotlights() {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error(`Member data request failed: ${response.status}`);
    const members = await response.json();
    const eligible = members.filter((member) => member.membershipLevel === 2 || member.membershipLevel === 3).sort(() => Math.random() - .5).slice(0, 3);
    spotlights.innerHTML = eligible.map(spotlightCard).join('');
  } catch (error) {
    spotlights.innerHTML = '<p class="directory-error">Member spotlights are unavailable right now.</p>';
    console.error(error);
  }
}

currentYear.textContent = new Date().getFullYear();
lastModified.textContent += document.lastModified;
loadWeather();
loadSpotlights();