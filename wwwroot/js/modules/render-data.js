import { getCommentsForPost, getCommentElement, getUsername, getAddCommentFormElement } from "./render-helpers.js";
import { submitAddPostFormData } from "./form-submit.js";
import { users, posts } from "./fetch-data.js";

// ----------- Page rendering ------------------------------------------------------

/**
 * Renders a form for adding a new post with all users of users.
 * @throws {Error} Throws an error if any of the operations fail.
 */
export function renderNewPostForm() {
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
    console.error("Error while rendering user form: " + error.message);
  }
}

/**
 * Renders a preview of all Posts in posts with an event to call function showPost.
 * @param {Array<{users: Array<Object>, posts: Array<Object>, comments: Array<Object>}>} data
 */
export function renderPosts() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = ""; // Clear any existing content

  for (let i = posts.length - 1; i >= 0; i--) {
    //posts.forEach((post) => {
    let post = posts[i];
    let bodyPreview = post.body.substring(0, 60);
    const spaceIndex = bodyPreview.lastIndexOf(" ");
    if (spaceIndex > 40) {
      bodyPreview = bodyPreview.slice(0, spaceIndex);
    }
    bodyPreview = "<p>" + bodyPreview + "..</p>";
    const title = "<h2>" + post.title + "</h2>";
    const tags = "<p>" + post.tags + "</p";
    const username = getUsername(post.userId);
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
  } //);
}

/**
 * Renders a Post with comments.
 * @param post Post to render.
 * @param username Username of poster.
 */
export function renderPost(post) {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = ""; // Clear any existing content

  const username = getUsername(post.userId);

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

  const likes = Object.assign(document.createElement("span"), {
    className: "react",
    textContent: post.reactions.likes + "❤️",
  });
  likes.addEventListener("click", () => {
    post.reactions.likes++;
    likes.textContent = post.reactions.likes + "❤️";
  });
  const dislikes = Object.assign(document.createElement("span"), {
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
