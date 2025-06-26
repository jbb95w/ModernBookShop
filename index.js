// Event Listener #1: Run code after page fully loads
window.addEventListener("DOMContentLoaded", start);
// Get HTML elements by their IDs
const searchButton = document.getElementById("searchBtn");
const searchInput = document.getElementById("searchInput");
const resultsArea = document.getElementById("results");
// Event Listener #2: When search button is clicked
searchButton.addEventListener("click", function () {
  performSearch();
});
