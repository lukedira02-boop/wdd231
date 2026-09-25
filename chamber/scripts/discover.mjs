import { places } from '../data/discover.mjs';

const cards = document.querySelector('#discover-cards');
const visitorMessage = document.querySelector('#visitor-message');
const visitKey = 'kansanga-discover-last-visit';
const currentYear = document.querySelector('#currentyear');
const lastModified = document.querySelector('#lastModified');

function getVisitMessage() {
  const now = Date.now();
  const previousVisit = Number(localStorage.getItem(visitKey));
  localStorage.setItem(visitKey, String(now));

  if (!previousVisit) return 'Welcome! Let us know if you have any questions.';

  const daysSinceVisit = Math.floor((now - previousVisit) / 86400000);
  if (daysSinceVisit < 1) return 'Back so soon! Awesome!';
  return `You last visited ${daysSinceVisit} ${daysSinceVisit === 1 ? 'day' : 'days'} ago.`;
}

function placeCard(place, index) {
  return `<article class="discover-card card-${index + 1}">
    <figure><img src="images/${place.image}" alt="${place.name}" width="300" height="200" loading="${index < 2 ? 'eager' : 'lazy'}"></figure>
    <div class="discover-card-content">
      <h2>${place.name}</h2>
      <address>${place.address}</address>
      <p>${place.description}</p>
      <button type="button" class="button-link discover-button">Learn More <span aria-hidden="true">↗</span></button>
    </div>
  </article>`;
}

visitorMessage.textContent = getVisitMessage();
cards.innerHTML = places.map(placeCard).join('');
currentYear.textContent = new Date().getFullYear();
lastModified.textContent += document.lastModified;