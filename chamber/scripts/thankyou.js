const params = new URLSearchParams(window.location.search);
const detailsList = document.querySelector('#application-details');
const message = document.querySelector('#application-message');
const membershipNames = {
  np: 'NP Membership',
  bronze: 'Bronze Membership',
  silver: 'Silver Membership',
  gold: 'Gold Membership',
};

const fields = [
  ['First name', 'first-name'],
  ['Last name', 'last-name'],
  ['Job title', 'title'],
  ['Business name', 'business-name'],
  ['Email', 'email'],
  ['Phone', 'phone'],
  ['Application date', 'application-date'],
  ['Business description', 'business-description'],
  ['Membership level', 'membership'],
  ['Submitted at', 'timestamp'],
];

const firstName = params.get('first-name');
if (!firstName || !detailsList || !message) {
  if (message) message.textContent = 'No application details were provided. Please use the join page to submit an application.';
  detailsList?.remove();
} else {
  message.textContent = `Thanks, ${firstName}. The chamber team will be in touch after reviewing your application.`;
  fields.forEach(([label, key]) => {
    const value = params.get(key);
    if (!value) return;

    const term = document.createElement('dt');
    const description = document.createElement('dd');
    term.textContent = label;
    description.textContent = key === 'membership' ? membershipNames[value] || value : value;
    detailsList.append(term, description);
  });
}
