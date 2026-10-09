const labels = new Map([
  ["spot", "Place or area"],
  ["dish", "What to try"],
  ["kind", "Food stop"],
  ["why", "Why it’s worth a visit"]
]);
const parameters = new URLSearchParams(window.location.search);
const submittedValues = document.querySelector("#submitted-values");
const introduction = document.querySelector("#result-intro");
const values = [...labels.entries()]
  .map(([key, label]) => [label, parameters.get(key)?.trim() || ""])
  .filter(([, value]) => value);

if (values.length) {
  introduction.textContent = "Your recommendation is ready to review. Thanks for adding a little local knowledge to the guide.";
  for (const [label, value] of values) {
    const term = document.createElement("dt");
    const description = document.createElement("dd");
    term.textContent = label;
    description.textContent = value;
    submittedValues.append(term, description);
  }
} else {
  introduction.textContent = "There isn’t a recommendation to review yet. Use the neighborhood form to share a place or food find.";
  submittedValues.hidden = true;
}
