/**
 * Fetches users, posts and comments from localStorage or fetches the data by calling
 * {@link fetchAllDummyJSON} if localStorage is empty.
 * @returns {Promise<{users: Array<Object>, posts: Array<Object>, comments: Array<Object>}>}
 * @throws {Error} Throws an error if any of the fetch operations fail.
 */
async function fetchPosts() {
  let data;

  try {
    if (localStorage.length > 0) {
      return JSON.parse(localStorage.getItem("data")); // Get data from localStorage
    } else {
      data = await fetchAllDummyJSON();

      localStorage.setItem("data", JSON.stringify(data)); // Store data in localStorage
      return data;
    }
  } catch (error) {
    console.error("Error while fetching: " + error + " Rethrowing to fetchData.");
    throw error;
  }
}

/**
 * Fetches users, posts and comments from DummyJSON API
 * @returns {Promise<{users: Array<Object>, posts: Array<Object>, comments: Array<Object>}>}
 */
async function fetchAllDummyJSON() {
  try {
    const [usersResponse, postsResponse, commentsResponse] = await Promise.all([
      fetch("https://dummyjson.com/users?limit=0"),
      fetch("https://dummyjson.com/posts?limit=0"),
      fetch("https://dummyjson.com/comments?limit=0"),
    ]);

    if (!usersResponse.ok) throw new Error("Failed to fetch users");
    if (!postsResponse.ok) throw new Error("Failed to fetch posts");
    if (!commentsResponse.ok) throw new Error("Failed to fetch comments");

    console.log("Data fetched from DummyJSON API.");

    const users = await usersResponse.json();
    const posts = await postsResponse.json();
    const comments = await commentsResponse.json();

    const data = {
      users: users.users,
      posts: posts.posts,
      comments: comments.comments,
    };

    return data;
  } catch (error) {
    console.error("Error while fetching data from DummyJSON API: " + error);
    throw error;
  }
}

/**
 * Displays data on a webpage.
 * @param {Array<{users: Array<Object>, posts: Array<Object>, comments: Array<Object>}>} data
 */
function renderPosts(data) {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = ""; // Clear any existing content

  data.posts.forEach((post) => {
    let bodyPreview = post.body.slice(0, 60);
    const spaceIndex = bodyPreview.lastIndexOf(" ");
    if (spaceIndex > 40) {
      bodyPreview = bodyPreview.slice(0, spaceIndex);
    }
    bodyPreview = "<p>" + bodyPreview + "..</p>";
    const title = "<h2>" + post.title + "</h2>";
    const tags = "<p>" + post.tags + "</p";
    const author = "<p><b> - " + data.users.filter((user) => user.id == post.userId)[0].username + "</b></p>";
    const postElement = document.createElement("article");
    postElement.addEventListener("click", () => {
      showPost(post);
    });
    postElement.className = "postPreview";
    postElement.id = "post" + post.id;
    postElement.innerHTML = title + bodyPreview + tags + author;
    mainContent.appendChild(postElement);
  });
}

async function showPost(post) {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = ""; // Clear any existing content

  const title = "<h2>" + post.title + "</h2>";
  const body = "<p>" + post.body + "<p>";
  const tags = "<p>" + post.tags + "</p";
  const likes = post.reactions.likes > 0 ? post.reactions.likes + "❤️ : " : "";
  const dislikes = post.reactions.dislikes > 0 ? post.reactions.dislikes + "💩" : "";
  const reactions = "<p>" + likes + dislikes + "</p>";
  const author = "<p>" + "</p>";
  const postElement = document.createElement("article");
  postElement.className = "post";
  postElement.innerHTML = title + body + tags + author + reactions;
  mainContent.appendChild(postElement);
  const comments = await getComments(post.id);
  comments.forEach((comment) => {
    mainContent.appendChild(showComment(comment));
  });
}

async function getComments(postId) {
  const data = await fetchPosts();
  return data.comments.filter((comment) => comment.postId == postId);
}

function showComment(comment) {
  const body = "<p>" + comment.body + "<p>";
  const author = "<p>" + comment.user.username + "<p>";
  const likes = "<p>" + comment.likes + "❤️<p>";

  const commentElement = document.createElement("article");
  commentElement.className = "comment";
  commentElement.innerHTML = body + author + likes;
  return commentElement;
}

/**
 * Calls {@link fetchPosts} to fetch data and {@link renderPosts} to render it in a posts div on a webpage.
 * @returns {Promise<void>}
 */
async function onPageLoad() {
  try {
    const data = await fetchPosts();
    console.log(data);
    renderPosts(data);
  } catch (error) {
    console.error("Error in fetchData:", error);
  }
}

// Call fetchData to initiate the process
onPageLoad();
