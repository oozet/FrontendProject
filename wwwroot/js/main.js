const clearLink = document.getElementById("clear-link");

// Add an event listener to clear localStorage when the link is clicked
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

const loginLink = document.getElementById("login-link");
loginLink.addEventListener("click", function (event) {
  event.preventDefault();
  renderAllUsers();
});

const redditLink = document.getElementById("reddit-link");
redditLink.addEventListener("click", function (event) {
  event.preventDefault();
  //getRedditPosts();
  alert("Data not retrieved from reddit because credentials are required!");
});

function getRedditPosts() {
  const subreddit = "javascript"; // Replace with your desired subreddit
  const url = `https://www.reddit.com/r/${subreddit}/.json`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data); // Logs the JSON data containing the posts
    })
    .catch((error) => {
      console.error("Error fetching posts:", error);
    });
}
