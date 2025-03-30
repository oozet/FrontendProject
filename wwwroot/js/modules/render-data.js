import { getCommentsForPost, getCommentElement, getUsername, getAddCommentFormElement, clearMainContent } from "./render-helpers.js";
import { submitAddPostFormData } from "./form-submit.js";
import { users, posts, saveToLocalStorage } from "./fetch-data.js";

// ----------- Page rendering ------------------------------------------------------

/**
 * Renders a form for adding a new post with all users of users.
 */
export function renderNewPostForm() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = ""; // Clear any existing content

  const parentElement = document.createElement("section");
  parentElement.className = "post-section";
  mainContent.appendChild(parentElement);

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
  parentElement.appendChild(articleElemenet);
  formElement.addEventListener("submit", submitAddPostFormData);
}

/**
 * Renders a preview of all Posts in global {@link posts} array.
 * Calls {@link renderPost} for each element in the array.
 */
export function renderPosts() {
  const mainContent = document.getElementById("main-content");
  mainContent.innerHTML = "";

  const postSection = document.createElement("section");
  postSection.className = "post-grid-section";
  mainContent.appendChild(postSection);

  for (let i = posts.length - 1; i >= 0; i--) {
    renderPost(posts[i], true, postSection);
  }
}

/**
 * Renders a Post with comments.
 * @param post Post to render.
 * @param {boolean} preview Preview or full view.
 */
export function renderPost(post, preview, parentElement = null) {
  if (!parentElement) {
    const mainContent = document.getElementById("main-content");
    mainContent.innerHTML = "";
    parentElement = document.createElement("section");
    parentElement.className = "post-section";
    mainContent.appendChild(parentElement);
  }
  // Clear content window to display full post.
  if (!preview) {
    parentElement.innerHTML = "";
  }

  const username = getUsername(post.userId);

  const tagsElement = document.createElement("p");
  for (let i = 0; i < post.tags.length; i++) {
    const tagElement = document.createElement("span");
    tagElement.className = "tag";
    tagElement.textContent = post.tags[i];
    tagsElement.appendChild(tagElement);
  }

  let body = post.body;
  if (preview) {
    body = post.body.substring(0, 60);
    const spaceIndex = body.lastIndexOf(" ");
    if (spaceIndex > 40) {
      body = body.slice(0, spaceIndex);
    }
  }

  const postElement = document.createElement("article");
  postElement.className = preview ? "postPreview" : "post";

  postElement.append(
    Object.assign(document.createElement("h2"), {
      className: "post-header",
      textContent: post.title,
    }),
    Object.assign(document.createElement("p"), {
      className: "post-body",
      textContent: body,
    }),
    tagsElement,
    Object.assign(document.createElement("b"), { textContent: "-" + username })
  );

  // Add likes/dislikes if full post view.
  if (!preview) {
    const likes = Object.assign(document.createElement("span"), {
      className: "react",
      textContent: post.reactions.likes + "❤️",
    });
    likes.addEventListener("click", () => {
      post.reactions.likes++;
      likes.textContent = post.reactions.likes + "❤️";
      saveToLocalStorage();
    });
    const dislikes = Object.assign(document.createElement("span"), {
      className: "react",
      textContent: post.reactions.dislikes + "💩",
    });
    dislikes.addEventListener("click", () => {
      post.reactions.dislikes++;
      dislikes.textContent = post.reactions.dislikes + "💩";
      saveToLocalStorage();
    });

    postElement.append(likes, dislikes);
  }

  if (preview) {
    // Add clicking
    postElement.addEventListener("click", () => {
      clearMainContent();
      renderPost(post, false);
    });
    // Add accessibility
    postElement.tabIndex = "0";
    postElement.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        clearMainContent();
        renderPost(post, false);
      }
    });
  }

  parentElement.appendChild(postElement);

  // Add comments and comment form element if not preview post
  if (!preview) {
    addComments(parentElement, post);

    parentElement.appendChild(getAddCommentFormElement(post.id));
  }
}

/**
 * Renders comments for a post.
 * @param post Post to get comments from
 * @param parentElement Element to append the comments to.
 */
function addComments(parentElement, post) {
  const comments = getCommentsForPost(post.id);
  const commentElement = document.createElement("section");
  commentElement.className = "comment-section";
  comments.forEach((comment) => {
    commentElement.appendChild(getCommentElement(comment));
  });
  if (commentElement.hasChildNodes()) {
    parentElement.appendChild(commentElement);
  }
}
