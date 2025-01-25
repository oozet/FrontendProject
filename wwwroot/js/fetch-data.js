/**
 * Fetches users, posts and comments from localStorage or fetches the data by calling
 * {@link fetchAllDummyJSON} if localStorage is empty.
 * @returns {Promise<{users: Array<Object>, posts: Array<Object>, comments: Array<Object>}>}
 * @throws {Error} Throws an error if any of the fetch operations fail.
 * @see fetchAllDummyJSON
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
      fetch("https://dummyjson.com/users"),
      fetch("https://dummyjson.com/posts"),
      fetch("https://dummyjson.com/comments"),
    ]);

    if (!usersResponse.ok) throw new Error("Failed to fetch users");
    if (!postsResponse.ok) throw new Error("Failed to fetch posts");
    if (!commentsResponse.ok) throw new Error("Failed to fetch comments");

    console.log("userResponse: " + usersResponse);

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
 * @param {Array} data
 */
function renderPosts(data) {
  const contentDiv = document.getElementById("content");
  contentDiv.innerHTML = ""; // Clear any existing content

  data.posts.forEach((post) => {
    let bodyPreview = post.body.slice(0, 60);
    const spaceIndex = bodyPreview.lastIndexOf(" ");
    if (spaceIndex > 40) {
      bodyPreview = "<p>" + bodyPreview.slice(0, spaceIndex) + "..</p>";
    }
    const title = "<h2>" + post.title + "</h2>";
    const tags = "<p>" + post.tags + "</p";
    const author = "<p>" + "</p>";
    const postElement = document.createElement("div");
    postElement.className = "post";
    postElement.innerHTML = title + bodyPreview + tags + author;
    contentDiv.appendChild(postElement);
  });
}

/**
 * Calls function to fetch data and function to render it in a posts div on a webpage.
 * @returns {Promise<void>}
 */
async function fetchData() {
  try {
    const data = await fetchPosts();
    console.log(data);
    renderPosts(data);
  } catch (error) {
    console.error("Error in fetchData:", error);
  }
}

// Call fetchData to initiate the process
fetchData();
