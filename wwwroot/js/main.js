// Add an event listener to clear localStorage when the link is clicked
const clearLink = document.getElementById("clear-link");
clearLink.addEventListener("click", function (event) {
  event.preventDefault();
  localStorage.clear();
  alert("LocalStorage has been cleared!");
});

const newPostLink = document.getElementById("newPost-link");
newPostLink.addEventListener("click", function (event) {
  event.preventDefault();
  renderNewPostForm();
});
