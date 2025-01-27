var data;

// ----------- Data retrieval ------------------------------------------------------

/**
 * Retrieves users, posts and comments from localStorage or fetches the data by calling
 * {@link fetchAllDummyJSON} if localStorage is empty.
 * @returns {Promise<{users: Array<Object>, posts: Array<Object>, comments: Array<Object>}>}
 * @throws {Error} Throws an error if any of the fetch operations fail.
 */
async function fetchData() {
  try {
    data = JSON.parse(localStorage.getItem("data")); // Get data from localStorage or null if not exists
    if (data == null) {
      data = await fetchAllDummyJSON();

      localStorage.setItem("data", JSON.stringify(data)); // Store data in localStorage
    }
  } catch (error) {
    console.error("Error while fetching: " + error + " Rethrowing to fetchData.");
    throw error;
  }
}

/**
 * Fetches users, posts and comments from DummyJSON API
 * @returns {Promise<{users: Array<Object>, posts: Array<Object>, comments: Array<Object>}>}
 * @throws {Error} Throws an error if any of the fetch operations fail.
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
 * Retrieves all comments for post with id postId from {@link fetchData} data.comments.
 * @param postId number identifier for the post to retrieve comments for.
 * @returns {Promise<{comments: Array<Object>}>}
 */
async function getCommentsForPost(postId) {
  return data.comments.filter((comment) => comment.postId == postId);
}

// ----------- Page rendering ------------------------------------------------------

/**
 * Renders a form with all users of data.users, Data retrieved by calling {@link fetchData}
 * @returns {Promise<{users: Array<Object>, posts: Array<Object>, comments: Array<Object>}>}
 * @throws {Error} Throws an error if any of the fetch operations fail.
 */
function renderNewPostForm() {
  try {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = ""; // Clear any existing content
    const articleElemenet = document.createElement("article");
    const formElement = document.createElement("form");

    formElement.appendChild(
      Object.assign(document.createElement("label"), {
        htmlFor: "title",
        innerText: "Title:",
      })
    );
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.id = "title";
    titleInput.name = "title";
    titleInput.required = true;
    formElement.appendChild(titleInput);

    formElement.appendChild(
      Object.assign(document.createElement("label"), {
        htmlFor: "body",
        innerText: "Message:",
      })
    );
    const bodyTextarea = document.createElement("textarea");
    bodyTextarea.id = "body";
    bodyTextarea.name = "body";
    bodyTextarea.required = true;
    formElement.appendChild(bodyTextarea);

    // const tagsInput = Object.assign(document.createElement("input"), {
    //   type: "text",
    //   id: "tags",
    //   name: "tags",
    //   required: true,
    // });
    formElement.appendChild(
      Object.assign(document.createElement("label"), {
        htmlFor: "tags",
        innerText: "Tags:",
      })
    );
    formElement.appendChild(
      Object.assign(document.createElement("input"), {
        type: "text",
        id: "tags",
        name: "tags",
        required: true,
      })
    );

    formElement.appendChild(
      Object.assign(document.createElement("label"), {
        htmlFor: "user",
        innerText: "Posting user:",
      })
    );
    const selectElement = document.createElement("select");
    selectElement.id = "userId";
    data.users.forEach((user) => {
      //   const optionElement = document.createElement("option");
      //   optionElement.value = user.id;
      //   optionElement.textContent = user.username;
      //   selectElement.appendChild(optionElement);
      selectElement.appendChild(Object.assign(document.createElement("option"), { value: user.id, textContent: user.username }));
    });
    formElement.appendChild(selectElement);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";
    formElement.appendChild(submitButton);

    articleElemenet.appendChild(formElement);
    mainContent.appendChild(articleElemenet);
    formElement.addEventListener("submit", submitFormData);
  } catch (error) {
    console.error("Error while rendering user form: " + error + " Rethrowing to caller.");
    throw error;
  }
}

function renderAllUsers() {
  try {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = ""; // Clear any existing content
    const articleElemenet = document.createElement("article");
    const formElement = document.createElement("form");

    const selectElement = document.createElement("select");
    data.users.forEach((user) => {
      const optionElement = document.createElement("option");
      optionElement.value = user.id;
      optionElement.textContent = user.username;
      selectElement.appendChild(optionElement);
    });
    formElement.appendChild(selectElement);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";
    formElement.appendChild(submitButton);

    articleElemenet.appendChild(formElement);
    mainContent.appendChild(articleElemenet);
  } catch (error) {
    console.error("Error while rendering user form: " + error + " Rethrowing to caller.");
    throw error;
  }
}

/**
 * Renders a preview of all Posts in data.posts with an event to call function showPost.
 * @param {Array<{users: Array<Object>, posts: Array<Object>, comments: Array<Object>}>} data
 */
function renderPosts() {
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
    const username = data.users.filter((user) => user.id == post.userId)[0].username;
    const author = "<p><b> - " + username + "</b></p>";
    const postElement = document.createElement("article");
    postElement.className = "postPreview";
    postElement.id = "post" + post.id;
    postElement.innerHTML = title + bodyPreview + tags + author;
    // Add clicking
    postElement.addEventListener("click", () => {
      renderPost(post, username);
    });
    // Add accessibility
    postElement.tabIndex = "0";
    postElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        renderPost(post);
      }
    });
    mainContent.appendChild(postElement);
  });
}

/**
 * Renders a Post with comments.
 * @param post Post to render.
 * @param username Username of poster.
 */
async function renderPost(post) {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = ""; // Clear any existing content

  const username = data.users.filter((user) => user.id == post.userId)[0].username;

  const title = "<h2>" + post.title + "</h2>";
  const body = "<p>" + post.body + "<p>";
  const tags = "<p>" + post.tags + "</p";
  const likes = post.reactions.likes > 0 ? post.reactions.likes + "❤️ : " : "";
  const dislikes = post.reactions.dislikes > 0 ? post.reactions.dislikes + "💩" : "";
  const reactions = "<p>" + likes + dislikes + "</p>";
  const author = "<p><b> - " + username + "</b></p>";
  const postElement = document.createElement("article");
  postElement.className = "post";
  postElement.innerHTML = title + body + tags + author + reactions;
  mainContent.appendChild(postElement);
  const comments = await getCommentsForPost(post.id);
  const commentElement = document.createElement("article");
  comments.forEach((comment) => {
    commentElement.appendChild(showComment(comment));
  });
  if (commentElement.hasChildNodes()) {
    mainContent.appendChild(commentElement);
  }
}

// --- Rendering helpers ---

/**
 * Creates a paragraph element for the comment.
 * @param post Post to render.
 * @param username Username of poster.
 * @returns {HTMLParagraphElement} commentElement
 */
function showComment(comment) {
  const body = "<p>" + comment.body + "<p>";
  const author = "<p>" + comment.user.username + "<p>";
  const likes = "<p>" + comment.likes + "❤️<p>";

  const commentElement = document.createElement("p");
  commentElement.className = "comment";
  commentElement.innerHTML = body + author + likes;
  return commentElement;
}

function getUsername(userId) {
  return data.users.filter((user) => user.id == userId)[0].username;
}

async function submitFormData() {
  let newPost;
  try {
    // Getting form data
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const tags = document.getElementById("tags").value;
    const userId = document.getElementById("userId").value;
    const id = data.posts.reduce((max, post) => (post.id > max ? post.id : max), 0) + 1;
    newPost = {
      id: id,
      title: title,
      body: body,
      tags: tags,
      reactions: {
        likes: 0,
        dislikes: 0,
      },
      views: 0,
      userId: userId,
    };

    data.posts.push(newPost);
    localStorage.setItem("data", JSON.stringify(data)); // Store data in localStorage

    console.log("Post successfully added:", newPost);
  } catch (error) {
    console.error("Error adding post:", error);
  } finally {
    renderPost(newPost);
  }
}
// ------------------------------------------------------------------------------------------

/**
 * Calls {@link fetchData} to fetch data and {@link renderPosts} to render it in a posts div on a webpage.
 * @returns {Promise<void>}
 */
async function onPageLoad() {
  try {
    if (data == null) {
      await fetchData();
    }
    console.log(data);
    renderPosts();
  } catch (error) {
    console.error("Error in fetchData:", error);
  }
}

// Call fetchData to initiate the process
onPageLoad();
