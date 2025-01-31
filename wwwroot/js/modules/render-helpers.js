import { submitAddCommentFormData } from "./form-submit.js";
import { users, comments } from "./fetch-data.js";
// --- Rendering helpers ---

/**
 * Retrieves all comments for post with id postId from {@link fetchData} comments.
 * @param postId number identifier for the post to retrieve comments for.
 * @returns {Promise<{comments: Array<Object>}>}
 */
export function getCommentsForPost(postId) {
  return comments.filter((comment) => comment.postId == postId);
}

/**
 * Creates a HTMLElement of a form to add a comment to a post
 * @returns {HTMLElement}
 * @param {number} postId The id of the current post.
 * @throws {Error} Throws an error if any of the fetch operations fail.
 */

export function getAddCommentFormElement(postId) {
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
export function getCommentElement(comment) {
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
export function getUsername(userId) {
  return users.filter((user) => user.id == userId)[0].username;
}
