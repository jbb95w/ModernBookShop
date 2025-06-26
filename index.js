window.addEventListener("DOMContentLoaded", start);

function start() {
  const searchButton = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const resultsArea = document.getElementById("results");

  const addBookForm = document.getElementById("addBookForm");
  const newTitle = document.getElementById("newTitle");
  const newAuthor = document.getElementById("newAuthor");
  const newYear = document.getElementById("newYear");

  // Search button click
  searchButton.addEventListener("click", function () {
    performSearch();
  });

  // Press Enter in input
  searchInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      performSearch();
    }
  });

  // Form submit for adding a new book
  addBookForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const bookData = {
      title: newTitle.value.trim() || "No Title",
      author_name: [newAuthor.value.trim() || "Unknown Author"],
      first_publish_year: newYear.value || "N/A",
    };

    showBooks([bookData]); // Add new book to DOM
    addBookForm.reset();
  });

  function performSearch() {
    const userSearch = searchInput.value.trim();

    if (userSearch === "") {
      alert("Please type a book name.");
      return;
    }

    const url =
      "https://openlibrary.org/search.json?q=" + encodeURI(userSearch);

    fetch(url)
      .then(function (response) {
        return response.json();
      })
      .then(function (data) {
        showBooks(data.docs);
      })
      .catch(function (error) {
        console.log("There was a problem:", error);
        resultsArea.innerHTML =
          "<p>Sorry, something went wrong. Please try again.</p>";
      });
  }

  function showBooks(bookList) {
    // Don't clear results for new books being added
    if (bookList.length !== 1) {
      resultsArea.innerHTML = "";
    }

    for (let i = 0; i < bookList.length; i++) {
      const book = bookList[i];

      const title = book.title || "No Title";
      const authors = book.author_name
        ? book.author_name.join(", ")
        : "Unknown Author";
      const year = book.first_publish_year || "N/A";

      let coverImage = "https://via.placeholder.com/100x150?text=No+Cover";
      if (book.cover_i) {
        coverImage =
          "https://covers.openlibrary.org/b/id/" + book.cover_i + "-M.jpg";
      }

      const bookCard = document.createElement("div");
      bookCard.className = "book-card";

      bookCard.innerHTML = `
        <img src="${coverImage}" alt="${title}" style="float:left;margin-right:10px;width:100px;height:150px;" />
        <h3>${title}</h3>
        <p><strong>Author:</strong> ${authors}</p>
        <p><strong>First Published:</strong> ${year}</p>
        <button class="edit-btn">Edit</button>
        <button class="remove-btn">Remove</button>
        <div style="clear:both"></div>
      `;

      // Remove button
      bookCard
        .querySelector(".remove-btn")
        .addEventListener("click", function () {
          bookCard.remove();
        });

      // Edit button
      bookCard
        .querySelector(".edit-btn")
        .addEventListener("click", function () {
          const newTitle = prompt("Edit book title:", title);
          const newAuthor = prompt("Edit author(s):", authors);
          const newYear = prompt("Edit publish year:", year);

          if (newTitle && newAuthor && newYear) {
            bookCard.querySelector("h3").textContent = newTitle;
            bookCard.querySelector(
              "p:nth-of-type(1)"
            ).innerHTML = `<strong>Author:</strong> ${newAuthor}`;
            bookCard.querySelector(
              "p:nth-of-type(2)"
            ).innerHTML = `<strong>First Published:</strong> ${newYear}`;
          }
        });

      resultsArea.appendChild(bookCard);
    }
  }
}
