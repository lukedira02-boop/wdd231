const directory = document.querySelector('#member-directory');
const statusMessage = document.querySelector('#directory-status');
const gridButton = document.querySelector('#grid-view');
const listButton = document.querySelector('#list-view');
const currentYear = document.querySelector('#currentyear');
const lastModified = document.querySelector('#lastModified');

const membershipNames = { 1: 'Member', 2: 'Silver member', 3: 'Gold member' };

function memberCard(member) {
  return `<article class="member-card">
    <div class="member-image"><img src="images/${member.image}" alt="${member.name} restaurant" width="160" height="160" loading="lazy"></div>
    <div class="member-content">
      <p class="membership membership-${member.membershipLevel}">${membershipNames[member.membershipLevel]}</p>
      <h3>${member.name}</h3>
      <p class="member-tagline">${member.tagline}</p>
      <address>${member.address}<br><a href="tel:${member.phone.replaceAll(' ', '')}">${member.phone}</a></address>
      <a class="member-link" href="${member.website}" target="_blank" rel="noopener">Visit website <span aria-hidden="true">↗</span></a>
    </div>
  </article>`;
}

function setView(view) {
  const isGrid = view === 'grid';
  directory.classList.toggle('grid-view', isGrid);
  directory.classList.toggle('list-view', !isGrid);
  gridButton.classList.toggle('active', isGrid);
  listButton.classList.toggle('active', !isGrid);
  gridButton.setAttribute('aria-pressed', String(isGrid));
  listButton.setAttribute('aria-pressed', String(!isGrid));
}

async function loadMembers() {
  try {
    const response = await fetch('data/members.json');
    if (!response.ok) throw new Error(`Member data request failed: ${response.status}`);
    const members = await response.json();
    directory.innerHTML = members.map(memberCard).join('');
    statusMessage.textContent = `${members.length} chamber members`;
  } catch (error) {
    statusMessage.textContent = 'The member directory is unavailable right now.';
    directory.innerHTML = '<p class="directory-error">Please refresh the page to try again.</p>';
    console.error(error);
  }
}

gridButton?.addEventListener('click', () => setView('grid'));
listButton?.addEventListener('click', () => setView('list'));
currentYear.textContent = new Date().getFullYear();
lastModified.textContent += document.lastModified;
loadMembers();
