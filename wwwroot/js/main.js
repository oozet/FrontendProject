import { renderNewPostForm } from "./modules/render-data.js";
import {onPageLoad, removeData} from "./modules/fetch-data.js";

  // Global data variable for fetched data.


window.onPageLoad = onPageLoad;

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
  
}

main();