// Event Listener #1: Run all JavaScript only after the page is fully loaded
window.addEventListener("DOMContentLoaded", start);

// Main function to run when the page is ready
function start() {
  // Get the elements from the HTML
  const searchButton = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsArea = document.getElementById("results");

  // Event Listener #2: When the user clicks the Search button
  searchButton.addEventListener("click", function () {
    performSearch();
  });

  // ✅ Event Listener #3: When user presses Enter inside the input box
  searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      performSearch();
    }
  });

  // This function runs the search
  function performSearch() {
    const userSearch = searchInput.value.trim();

    // If nothing typed, show alert and stop
    if (userSearch === "") {
      alert("Please type a book name.");
      return;
    }

    // Build the API URL using the user's search
    const url =
      "https://openlibrary.org/search.json?q=" + encodeURIComponent(userSearch);

    // Use fetch to get book data from the API
    fetch(url)
      .then(function (response) {
        return response.json(); // Convert to JSON
      })
      .then(function (data) {
        showBooks(data.docs); // Show books on the page
      })
      .catch(function (error) {
        console.log("There was a problem:", error);
        resultsArea.innerHTML =
          "<p>Sorry, something went wrong. Please try again.</p>";
      });
  }

  // This function displays the books in the results area
  function showBooks(bookList) {
    resultsArea.innerHTML = ""; // Clear old results

    // If no books found, show a message
    if (!bookList || bookList.length === 0) {
      resultsArea.innerHTML = "<p>No books found.</p>";
      return;
    }

    // Loop through each book
    for (let i = 0; i < bookList.length; i++) {
      const book = bookList[i];

      // Get the book details safely
      const title = book.title || "No Title";
      const authors = book.author_name
        ? book.author_name.join(", ")
        : "Unknown Author";
      const year = book.first_publish_year || "N/A";

      // Get the cover image if available
      let coverImage = "https://via.placeholder.com/100x150?text=No+Cover";
      if (book.cover_i) {
        coverImage =
          "https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg";
      }

      // Create a card for the book
      const bookCard = document.createElement("div");
      bookCard.className = "book-card";

      // Fill in the book card
      bookCard.innerHTML = `
        <img src="${coverImage}" alt="${title}" style="float:left;margin-right:10px;width:100px;height:150px;" />
        <h3>${title}</h3>
        <p><strong>Author:</strong> ${authors}</p>
        <p><strong>First Published:</strong> ${year}</p>
        <div style="clear:both"></div>
      `;

      // Add the book card to the results area
      resultsArea.appendChild(bookCard);
    }
  }
}
