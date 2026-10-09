const foodGrid = document.querySelector("#food-grid");
const searchInput = document.querySelector("#food-search");
const categoryFilter = document.querySelector("#category-filter");
const favoritesOnly = document.querySelector("#favorites-only");
const statusMessage = document.querySelector("#catalogue-status");
const emptyState = document.querySelector("#food-empty");
const errorState = document.querySelector("#food-error");
const dialog = document.querySelector("#food-dialog");
const dialogContent = document.querySelector("#dialog-content");
const favoriteSummary = document.querySelector("#favorite-summary");
const clearFiltersButton = document.querySelector("#clear-filters");

let dishes = [];
let favorites = new Set();
let dialogReturnFocusId = "";

try {
  const saved = JSON.parse(localStorage.getItem("kansanga-table-notes:favorites") || "[]");
  if (Array.isArray(saved)) favorites = new Set(saved.filter((id) => typeof id === "string"));
} catch {
  favoriteSummary.textContent = "Saved dishes are available while this page stays open.";
}

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[character]);
}

function saveFavorites() {
  try {
    localStorage.setItem("kansanga-table-notes:favorites", JSON.stringify([...favorites]));
    return true;
  } catch {
    favoriteSummary.textContent = "Browser storage is unavailable; saved dishes will last only until you leave this page.";
    return false;
  }
}

function updateFavoriteSummary() {
  if (favoriteSummary.textContent.includes("Browser storage is unavailable") || favoriteSummary.textContent.includes("available while this page stays open")) return;
  const count = favorites.size;
  favoriteSummary.textContent = count === 0
    ? "Your saved tasting list lives on this device."
    : `${count} ${count === 1 ? "dish" : "dishes"} saved to your tasting list on this device.`;
}

function filteredDishes() {
  const query = searchInput.value.trim().toLocaleLowerCase();
  const category = categoryFilter.value;
  return dishes.filter((dish) => {
    const searchable = [dish.name, dish.category, dish.description, dish.madeWith, dish.enjoyedWith, dish.moment, dish.character].join(" ").toLocaleLowerCase();
    return (!query || searchable.includes(query))
      && (category === "all" || dish.category === category)
      && (!favoritesOnly.checked || favorites.has(dish.id));
  });
}

function renderDishes() {
  const results = filteredDishes();
  foodGrid.innerHTML = results.map((dish, index) => {
    const isSaved = favorites.has(dish.id);
    return `
      <article class="food-card" id="${escapeHTML(dish.id)}">
        <div class="food-card-art art-tone-${index % 5}${dish.image ? " has-photo" : ""}">
          ${dish.image
            ? `<img src="${escapeHTML(dish.image)}" alt="${escapeHTML(dish.imageAlt)}" width="${Number(dish.imageWidth)}" height="${Number(dish.imageHeight)}" loading="lazy" decoding="async">`
            : `<div aria-hidden="true"><span class="food-art-symbol">${escapeHTML(dish.symbol)}</span><span class="food-art-label">FIELD NOTE<br>${String(dishes.indexOf(dish) + 1).padStart(2, "0")}</span><span class="food-art-line"></span></div>`}
        </div>
        <div class="food-card-copy">
          <div class="food-card-meta"><span class="dish-category">${escapeHTML(dish.category)}</span>
            <button class="favorite-button${isSaved ? " is-saved" : ""}" id="dish-save-${escapeHTML(dish.id)}" type="button" data-favorite="${escapeHTML(dish.id)}" aria-pressed="${isSaved}" aria-label="${isSaved ? "Remove" : "Save"} ${escapeHTML(dish.name)} ${isSaved ? "from" : "to"} your tasting list"><span aria-hidden="true">${isSaved ? "♥" : "♡"}</span> ${isSaved ? "Saved" : "Save"}</button>
          </div>
          <h3><button class="dish-title-button" id="dish-open-${escapeHTML(dish.id)}" type="button" data-details="${escapeHTML(dish.id)}">${escapeHTML(dish.name)} <span aria-hidden="true">↗</span></button></h3>
          <p>${escapeHTML(dish.description)}</p>
          <button class="read-note" type="button" data-details="${escapeHTML(dish.id)}">Open field note <span aria-hidden="true">→</span></button>
        </div>
      </article>`;
  }).join("");

  emptyState.hidden = results.length > 0;
  foodGrid.hidden = results.length === 0;
  statusMessage.textContent = results.length === 1 ? "1 field note." : `${results.length} field notes.`;
  updateFavoriteSummary();
}

function showDishDetails(id) {
  const dish = dishes.find((item) => item.id === id);
  if (!dish) return;

  dialogContent.innerHTML = `
    <p class="eyebrow"><span class="eyebrow-rule"></span> ${escapeHTML(dish.category)}</p>
    <div class="dialog-art" aria-hidden="true">${escapeHTML(dish.symbol)}</div>
    <h2 id="dialog-title">${escapeHTML(dish.name)}</h2>
    <p class="dialog-description">${escapeHTML(dish.description)}</p>
    <dl class="dish-details">
      <div><dt>Made with</dt><dd>${escapeHTML(dish.madeWith)}</dd></div>
      <div><dt>Enjoyed with</dt><dd>${escapeHTML(dish.enjoyedWith)}</dd></div>
      <div><dt>A good moment for</dt><dd>${escapeHTML(dish.moment)}</dd></div>
      <div><dt>On the palate</dt><dd>${escapeHTML(dish.character)}</dd></div>
    </dl>
    <button class="button button-dark dialog-save" type="button" data-favorite="${escapeHTML(dish.id)}" aria-pressed="${favorites.has(dish.id)}">${favorites.has(dish.id) ? "♥ Saved to your list" : "♡ Save to your tasting list"}</button>`;

  dialog.showModal();
  dialogReturnFocusId = `dish-open-${dish.id}`;
}

function toggleFavorite(id, source = "card") {
  if (favorites.has(id)) favorites.delete(id);
  else favorites.add(id);
  saveFavorites();
  renderDishes();
  if (dialog.open) {
    const dialogButton = dialogContent.querySelector("[data-favorite]");
    if (dialogButton) {
      const isSaved = favorites.has(id);
      dialogButton.setAttribute("aria-pressed", String(isSaved));
      dialogButton.textContent = isSaved ? "♥ Saved to your list" : "♡ Save to your tasting list";
      dialogButton.focus();
    }
  } else if (source === "card") {
    const saveButton = document.getElementById(`dish-save-${id}`);
    if (saveButton) saveButton.focus();
    else favoritesOnly.focus();
  }
}

foodGrid.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) {
    toggleFavorite(favoriteButton.dataset.favorite, "card");
    return;
  }
  const detailsButton = event.target.closest("[data-details]");
  if (detailsButton) showDishDetails(detailsButton.dataset.details);
});

dialogContent.addEventListener("click", (event) => {
  const favoriteButton = event.target.closest("[data-favorite]");
  if (favoriteButton) toggleFavorite(favoriteButton.dataset.favorite, "dialog");
});

dialog.addEventListener("click", (event) => {
  if (event.target === dialog) dialog.close();
});

dialog.addEventListener("close", () => {
  if (dialogReturnFocusId) document.getElementById(dialogReturnFocusId)?.focus();
});

searchInput.addEventListener("input", renderDishes);
categoryFilter.addEventListener("change", renderDishes);
favoritesOnly.addEventListener("change", renderDishes);
clearFiltersButton.addEventListener("click", () => {
  searchInput.value = "";
  categoryFilter.value = "all";
  favoritesOnly.checked = false;
  renderDishes();
  searchInput.focus();
});

async function loadDishes() {
  try {
    const response = await fetch("foods.json");
    if (!response.ok) throw new Error(`Dish data request failed (${response.status})`);
    const data = await response.json();
    if (!Array.isArray(data)) throw new Error("Dish data must be a list");
    dishes = data;
    const categories = [...new Set(dishes.map((dish) => dish.category))].sort();
    categoryFilter.insertAdjacentHTML("beforeend", categories.map((category) => `<option value="${escapeHTML(category)}">${escapeHTML(category)}</option>`).join(""));
    errorState.hidden = true;
    renderDishes();
    if (window.location.hash) {
      requestAnimationFrame(() => {
        document.getElementById(window.location.hash.slice(1))?.scrollIntoView();
      });
    }
  } catch (error) {
    console.error("Unable to load local dish data:", error);
    statusMessage.textContent = "Dish notes are unavailable.";
    foodGrid.hidden = true;
    errorState.hidden = false;
  }
}

loadDishes();
