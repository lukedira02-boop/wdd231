const form = document.querySelector('#membership-form');
const timestamp = document.querySelector('#timestamp');
const applicationDate = document.querySelector('#application-date');
const planTitle = document.querySelector('#selected-plan');
const planPrice = document.querySelector('#selected-price');
const dialog = document.querySelector('#membership-dialog');
const dialogTitle = document.querySelector('#dialog-title');
const dialogPrice = document.querySelector('#dialog-price');
const dialogBenefits = document.querySelector('#dialog-benefits');
const membershipOptions = document.querySelectorAll('input[name="membership"]');
const membershipDetails = {
  np: {
    title: 'NP Membership',
    price: '$0 / year',
    benefits: ['Member directory listing', 'Invitations to chamber networking events', 'Community and market updates'],
  },
  bronze: {
    title: 'Bronze Membership',
    price: '$250 / year',
    benefits: ['All NP benefits', 'Business listing with expanded profile', 'Member event registration access'],
  },
  silver: {
    title: 'Silver Membership',
    price: '$500 / year',
    benefits: ['All Bronze benefits', 'One business spotlight each year', 'Discounted event sponsorship opportunities'],
  },
  gold: {
    title: 'Gold Membership',
    price: '$1,000 / year',
    benefits: ['All Silver benefits', 'Priority directory placement', 'Premium event and advertising opportunities'],
  },
};

function getLocalDate() {
  const today = new Date();
  const offset = today.getTimezoneOffset() * 60_000;
  return new Date(today.getTime() - offset).toISOString().slice(0, 10);
}

function updatePlanSummary() {
  const selected = document.querySelector('input[name="membership"]:checked');
  const details = selected ? membershipDetails[selected.value] : null;
  if (!details || !planTitle || !planPrice) return;

  planTitle.textContent = details.title;
  planPrice.textContent = details.price;
}

function showMembershipDetails(level) {
  const details = membershipDetails[level];
  if (!details || !dialog || !dialogTitle || !dialogPrice || !dialogBenefits) return;

  dialogTitle.textContent = details.title;
  dialogPrice.textContent = details.price;
  dialogBenefits.replaceChildren();
  details.benefits.forEach((benefit) => {
    const item = document.createElement('li');
    item.textContent = benefit;
    dialogBenefits.append(item);
  });
  dialog.showModal();
}

if (applicationDate) applicationDate.value = getLocalDate();
if (timestamp) timestamp.value = new Date().toISOString();

membershipOptions.forEach((option) => {
  option.addEventListener('change', updatePlanSummary);
});

document.querySelectorAll('[data-membership]').forEach((button) => {
  button.addEventListener('click', () => showMembershipDetails(button.dataset.membership));
});

document.querySelector('.dialog-close')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', (event) => {
  if (event.target === dialog) dialog.close();
});

form?.addEventListener('submit', () => {
  if (timestamp) timestamp.value = new Date().toISOString();
});

form?.addEventListener('reset', () => {
  window.setTimeout(() => {
    updatePlanSummary();
    if (applicationDate) applicationDate.value = getLocalDate();
    if (timestamp) timestamp.value = new Date().toISOString();
  });
});

updatePlanSummary();
