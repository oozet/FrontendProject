// Global data variable for fetched data.
var users;
var posts;
var comments;

// ----------- Data retrieval ------------------------------------------------------

/**
 * Retrieves users, posts and comments from localStorage or fetches the data by calling
 * {@link fetchAllDummyJSON} if localStorage is empty.
 * @throws {Error} Throws an error if any of the fetch operations fail.
 */
async function fetchData() {
  try {
    const data = JSON.parse(localStorage.getItem("data")); // Get data from localStorage or null if not exists
    if (data == null) // or undefined
    {
      data = await fetchAllDummyJSON();

      localStorage.setItem("data", JSON.stringify(data)); // Store data in localStorage
    }

    users = data.users;
    posts = data.posts;
    comments = data.comments;

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
 * Retrieves all comments for post with id postId from {@link fetchData} comments.
 * @param postId number identifier for the post to retrieve comments for.
 * @returns {Promise<{comments: Array<Object>}>}
 */
function getCommentsForPost(postId) {
  return comments.filter((comment) => comment.postId == postId);
}

// ----------- Page rendering ------------------------------------------------------

/**
 * Renders a form for adding a new post with all users of users.
 * @throws {Error} Throws an error if any of the operations fail.
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
        textContent: "Title:",
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
        textContent: "Message:",
      })
    );
    const bodyTextarea = document.createElement("textarea");
    bodyTextarea.id = "body";
    bodyTextarea.name = "body";
    bodyTextarea.required = true;
    formElement.appendChild(bodyTextarea);

    formElement.appendChild(
      Object.assign(document.createElement("label"), {
        htmlFor: "tags",
        textContent: "Tags:",
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
        textContent: "Posting user:",
      })
    );
    const selectElement = document.createElement("select");
    selectElement.id = "userId";
    users.forEach((user) => {
      selectElement.appendChild(Object.assign(document.createElement("option"), { value: user.id, textContent: user.username }));
    });
    formElement.appendChild(selectElement);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";
    formElement.appendChild(submitButton);

    articleElemenet.appendChild(formElement);
    mainContent.appendChild(articleElemenet);
    formElement.addEventListener("submit", submitAddPostFormData);
  } catch (error) {
    console.error("Error while rendering user form: " + error + " Rethrowing to caller.");
    throw error;
  }
}

/**
 * Renders a preview of all Posts in posts with an event to call function showPost.
 * @param {Array<{users: Array<Object>, posts: Array<Object>, comments: Array<Object>}>} data
 */
function renderPosts() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = ""; // Clear any existing content

  posts.forEach((post) => {
    let bodyPreview = post.body.substring(0, 60);
    const spaceIndex = bodyPreview.lastIndexOf(" ");
    if (spaceIndex > 40) {
      bodyPreview = bodyPreview.slice(0, spaceIndex);
    }
    bodyPreview = "<p>" + bodyPreview + "..</p>";
    const title = "<h2>" + post.title + "</h2>";
    const tags = "<p>" + post.tags + "</p";
    const username = users.filter((user) => user.id == post.userId)[0].username;
    const author = "<p><b> - " + username + "</b></p>";
    const postElement = document.createElement("article");
    postElement.className = "postPreview";
    postElement.innerHTML = title + bodyPreview + tags + author;
    // Add clicking
    postElement.addEventListener("click", () => {
      renderPost(post);
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
function renderPost(post) {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = ""; // Clear any existing content

  const username = users.filter((user) => user.id == post.userId)[0].username;

  const postElement = document.createElement("article");
  postElement.append(
    Object.assign(document.createElement("h2"), {
      textContent: post.title,
    }),
    Object.assign(document.createElement("p"), {
      textContent: post.body,
    }),
    Object.assign(document.createElement("p"), {
      textContent: post.tags,
    }),
    Object.assign(document.createElement("b"), {
      innerHTML: "<b>" + username + "</b>",
    })
  );

  const likes = Object.assign(document.createElement("p"), {
    textContent: post.reactions.likes,
  });
  likes.appendChild(Object.assign(document.createElement("div"), { className: "react", textContent: "❤️" }));
  likes.addEventListener("click", () => {
    post.reactions.likes++;
    likes.textContent = post.reactions.likes + "❤️";
  });
  const dislikes = Object.assign(document.createElement("p"), {
    className: "react",
    textContent: post.reactions.dislikes + "💩",
  });
  dislikes.addEventListener("click", () => {
    post.reactions.dislikes++;
    dislikes.textContent = post.reactions.dislikes + "💩";
  });

  postElement.append(likes, dislikes);

  postElement.className = "post";
  mainContent.appendChild(postElement);
  const comments = getCommentsForPost(post.id);
  const commentElement = document.createElement("article");
  comments.forEach((comment) => {
    commentElement.appendChild(getCommentElement(comment));
  });
  if (commentElement.hasChildNodes()) {
    mainContent.appendChild(commentElement);
  }

  mainContent.appendChild(getAddCommentFormElement(post.id));
}

// --- Rendering helpers ---


/**
 * Creates a HTMLElement of a form to add a comment to a post
 * @returns {HTMLElement}
 * @param {number} postId The id of the current post.
 * @throws {Error} Throws an error if any of the fetch operations fail.
 */
function getAddCommentFormElement(postId) {
  try {
    const articleElemenet = document.createElement("article");
    const formElement = document.createElement("form");

    formElement.appendChild(
      Object.assign(document.createElement("label"), {
        htmlFor: "commentBody",
        textContent: "Comment:",
      })
      );
    
    const postIdElement = document.createElement("input");
    postIdElement.id = "postId";
    postIdElement.value = postId;
    postIdElement.type = "hidden";
    formElement.appendChild(postIdElement);

    const bodyTextarea = document.createElement("textarea");
    bodyTextarea.id = "commentBody";
    bodyTextarea.name = "commentBody";
    bodyTextarea.required = true;
    formElement.appendChild(bodyTextarea);

    formElement.appendChild(
      Object.assign(document.createElement("label"), {
        htmlFor: "user",
        textContent: "Posting user:",
      })
    );
    const selectElement = document.createElement("select");
    selectElement.id = "userId";
    users.forEach((user) => {
      selectElement.appendChild(Object.assign(document.createElement("option"), { value: user.id, textContent: user.username }));
    });
    formElement.appendChild(selectElement);

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.textContent = "Submit";
    formElement.appendChild(submitButton);

    articleElemenet.appendChild(formElement);
    formElement.addEventListener("submit", submitAddCommentFormData);

    return articleElemenet;
  } catch (error) {
    console.error("Error while rendering user form: " + error + " Rethrowing to caller.");
    throw error;
  }
}

/**
 * Creates a paragraph element for a comment.
 * @param {Object} comment Comment to get data from.
 * @returns {HTMLParagraphElement} commentElement
 */
function getCommentElement(comment) {
  const body = "<p>" + comment.body + "<p>";
  const author = "<p>" + comment.user.username + "<p>";
  const likes = "<p>" + comment.likes + "❤️<p>";

  const commentElement = document.createElement("p");
  commentElement.className = "comment";
  commentElement.innerHTML = body + author + likes;
  return commentElement;
}

/**
 * Gets the username of user with id userId.
 * @param {number} userId
 * @returns {string} username
 */
function getUsername(userId) {
  return users.filter((user) => user.id == userId)[0].username;
}

// -------- Form submit functions ------------------------------------

/**
 * Get data from addPostForm to create a new post and save in global variable and localStorage.
 * Then shows the new post on the page {@link renderPost}
 */
function submitAddPostFormData() {
  let newPost;
  try {
    // Getting form data
    const title = document.getElementById("title").value;
    const body = document.getElementById("body").value;
    const tags = document.getElementById("tags").value;
    const cleanedTags = tags
      .split(/\s+/) // Split by whitespace
      .map((word) => word.replace(/[^a-zA-Z0-9]/g, "")) // Remove non-alphanumeric characters
      .filter((word) => word.length > 0); // Filter out any empty strings
    const userId = document.getElementById("userId").value;
    const id = posts.reduce((max, post) => (post.id > max ? post.id : max), 0) + 1;
    newPost = {
      id: id,
      title: title,
      body: body,
      tags: cleanedTags,
      reactions: {
        likes: 0,
        dislikes: 0,
      },
      views: 0,
      userId: userId,
    };

    posts.push(newPost);
    localStorage.setItem("data", JSON.stringify(data)); // Store data in localStorage

  } catch (error) {
    console.error("Error adding post:", error);
  } finally {
    renderPost(newPost);
  }
}

/**
 * Get data from addCommentForm to create a new comment and save in global variable and localStorage.
 * Then shows the new post on the page {@link renderPost}
 */
function submitAddCommentFormData() {
  let postId;
  try {
    // Getting form data
    const body = document.getElementById("commentBody").value;
    const user = users.find((user) => user.id == document.getElementById("userId").value);
    postId = document.getElementById("postId").value;
    const id = comments.reduce((max, comment) => (comment.id > max ? comment.id : max), 0) + 1;
    const userData = {id: user.id, fullName: user.firstName + " " + user.lastName, username: user.username};
    newComment = {
      id: id,
      body: body,
      likes: 0,
      postId: postId,
      user: userData,
    };

    comments.push(newComment);
    localStorage.setItem("data", JSON.stringify(data)); // Store data in localStorage

  } catch (error) {
    console.error("Error adding post:", error);
  }
  finally
  {
    renderPost(posts.find((post) => post.id == postId))
  }
}

// -------- Call when loading page ----------------------------------------------------

/**
 * Calls {@link fetchData} to fetch data and {@link renderPosts} to render it in a posts div on a webpage.
 */
async function onPageLoad() {
  try {
    if (users == null || comments == null || posts == null) // or undefined
    {
      await fetchData();
    }
    renderPosts();
  } catch (error) {
    console.error("Error while loading page: ", error);
  }
}

// Call onPageLoad to initiate loading the page.
onPageLoad();
