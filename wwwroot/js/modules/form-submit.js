import {renderPost} from "./render-data.js";
import { users, posts, comments } from "./fetch-data.js";
// -------- Form submit functions ------------------------------------
class Post{
  constructor(id, title, body, tags, userId) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.tags = tags;
    this.reactions = {
      likes: 0,
      dislikes: 0,
    };
    this.views = 0;
    this.userId = userId;
  }
}

class Comment {
  constructor(id, body, postId, userData) {
    this.id = id;
    this.body = body;
    this.likes = 0;
    this.postId = postId;
    this.user = userData;
  }
}
/**
 * Get data from addPostForm to create a new post and save in global variable and localStorage.
 * Then shows the new post on the page {@link renderPost}
 */
export function submitAddPostFormData() {
 
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

    const newPost = new Post(id, title, body, cleanedTags, userId);
    
    posts.push(newPost);
    localStorage.setItem("data.posts", JSON.stringify(posts)); // Store data in localStorage
    renderPost(newPost);
  } catch (error) {
    console.error("Error adding post:", error.message);
  }
}

/**
 * Get data from addCommentForm to create a new comment and save in global variable and localStorage.
 * Then shows the new post on the page {@link renderPost}
 */
export function submitAddCommentFormData() {
  let postId;
  try {
    // Getting form data
    const body = document.getElementById("commentBody").value;
    const user = users.find((user) => user.id == document.getElementById("userId").value);
    postId = document.getElementById("postId").value;
    const id = comments.reduce((max, comment) => (comment.id > max ? comment.id : max), 0) + 1;
    const userData = { id: user.id, fullName: user.firstName + " " + user.lastName, username: user.username };
    const newComment = new Comment(id, body, postId, userData);

    comments.push(newComment);
    localStorage.setItem("data.comments", JSON.stringify(comments)); // Store data in localStorage
  } catch (error) {
    console.error("Error adding post:", error);
  } finally {
    renderPost(posts.find((post) => post.id == postId));
  }
}
