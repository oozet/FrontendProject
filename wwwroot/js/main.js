const clearLink = document.getElementById("clear-link");

// Add an event listener to clear localStorage when the link is clicked
clearLink.addEventListener("click", function (event) {
  event.preventDefault(); // Prevent the default link behavior
  localStorage.clear();
  alert("LocalStorage has been cleared!");
});
