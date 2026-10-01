const weatherUrl = 'https://api.open-meteo.com/v1/forecast?latitude=0.3136&longitude=32.5811&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto&forecast_days=3';
const weatherCodeLabels = {
  0: 'Clear sky',
  1: 'Mostly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Foggy',
  48: 'Foggy',
  51: 'Light drizzle',
  53: 'Drizzle',
  55: 'Heavy drizzle',
  56: 'Freezing drizzle',
  57: 'Heavy freezing drizzle',
  61: 'Light rain',
  63: 'Rain',
  65: 'Heavy rain',
  66: 'Freezing rain',
  67: 'Heavy freezing rain',
  71: 'Light snow',
  73: 'Snow',
  75: 'Heavy snow',
  77: 'Snow grains',
  80: 'Rain showers',
  81: 'Heavy showers',
  82: 'Violent showers',
  85: 'Light snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with hail',
  99: 'Severe thunderstorm'
};
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

function describeWeather(code) {
  return weatherCodeLabels[code] || 'Current conditions';
}

function renderForecast(items) {
  forecast.innerHTML = items.slice(0, 3).map((item) => `<div class="forecast-day"><p>${formatDay(new Date(item.date))}</p><strong>${Math.round(item.high)}°C</strong><p>${describeWeather(item.code)}</p></div>`).join('');
}

async function loadWeather() {
  try {
    const response = await fetch(weatherUrl);
    if (!response.ok) throw new Error('Weather request failed');

    const data = await response.json();
    const current = data.current;
    const daily = data.daily;

    currentTemperature.textContent = `${Math.round(current.temperature_2m)}°C`;
    weatherDescription.textContent = describeWeather(current.weather_code);

    const forecastItems = daily.time.map((date, index) => ({
      date,
      high: daily.temperature_2m_max[index],
      code: daily.weather_code[index]
    }));

    renderForecast(forecastItems);
  } catch (error) {
    currentTemperature.textContent = '24°C';
    weatherDescription.textContent = 'Warm and breezy';
    forecast.innerHTML = ['Today', 'Tomorrow', 'Saturday'].map((day, index) => `<div class="forecast-day"><p>${day}</p><strong>${[24, 25, 23][index]}°C</strong><p>Kampala outlook</p></div>`).join('');
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