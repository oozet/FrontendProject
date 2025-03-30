import { renderPost } from "./render-data.js";
import { users, posts, comments, saveToLocalStorage } from "./fetch-data.js";

import { Post } from "../models/post.js";
import { Comment } from "../models/comment.js";

// -------- Form submit functions ------------------------------------

/**
 * Get data from addPostForm to create a new post and save in global variable and localStorage.
 * Then shows the new post on the page {@link renderPost}
 */
export function submitAddPostFormData() {
  // Getting form data
  const title = document.getElementById("title").value;
  const body = document.getElementById("body").value;
  const tags = document.getElementById("tags").value;
  const cleanedTags = tags
    .split(/\s+/) // Split by whitespace
    .map((word) => word.replace(/[^a-zA-Z0-9]/g, "")) // Remove non-alphanumeric characters
    .filter((word, index, array) => array.indexOf(word) === index) // Remove duplicates
    .filter((word) => word.length > 0); // Filter out any empty strings
  const userId = document.getElementById("userId").value;
  const id = posts.reduce((max, post) => (post.id > max ? post.id : max), 0) + 1;

  const newPost = new Post(id, title, body, cleanedTags, userId);

  posts.push(newPost);
  saveToLocalStorage();

  renderPost(newPost, false);
}

/**
 * Get data from addCommentForm to create a new comment and save in global variable and localStorage.
 * Then shows the new post on the page {@link renderPost}
 */
export function submitAddCommentFormData() {
  // Getting form data
  const body = document.getElementById("commentBody").value;
  const user = users.find((user) => user.id == document.getElementById("userId").value);
  const postId = document.getElementById("postId").value;
  const id = comments.reduce((max, comment) => (comment.id > max ? comment.id : max), 0) + 1;
  const userData = { id: user.id, fullName: user.firstName + " " + user.lastName, username: user.username };
  const newComment = new Comment(id, body, postId, userData);

  comments.push(newComment);
  saveToLocalStorage();

  renderPost(
    posts.find((post) => post.id == postId),
    false
  );
}
