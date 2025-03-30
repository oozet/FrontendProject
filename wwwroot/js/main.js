import { renderNewPostForm } from "./modules/render-data.js";
import { onPageLoad, removeData } from "./modules/fetch-data.js";

/**
 * Instead of adding an event listener to the Home link,
 * this binds the onclick function call to an imported function.
 */
/**
 * Adds event listeners to main page navigation fields and
 */
function main() {
  // Add an event listener to clear localStorage when the link is clicked
  const clearLink = document.getElementById("clear-link");
  clearLink.addEventListener("click", function (event) {
    event.preventDefault();
    localStorage.clear();
    removeData();
    alert("LocalStorage has been cleared!");
  });

  const newPostLink = document.getElementById("newPost-link");
  newPostLink.addEventListener("click", function (event) {
    event.preventDefault();
    renderNewPostForm();
  });

  const homeLink = document.getElementById("home-link");
  homeLink.addEventListener("click", function (event) {
    event.preventDefault();
    onPageLoad();
  });
}

main();
