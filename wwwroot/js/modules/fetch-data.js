import {renderPosts} from "./render-data.js";

class Post{
  constructor(id, title, body, cleanedTags, userId){
    this.id = id;
    this.title = title;
    this.body = body;
    this.tags = tags
    this.reactions = { likes: 0, dislikes: 0 }
    this.views = 0;
    this.userId = userId;
  }
}
var users;
var posts;
var comments;

export {users, posts, comments}
// ----------- Data retrieval ------------------------------------------------------

/**
 * Retrieves users, posts and comments from localStorage or fetches the data by calling
 * {@link fetchAllDummyJSON} if localStorage is empty.
 * @throws {Error} Throws an error if any of the fetch operations fail.
 */
async function fetchData() {
  try {
    let data = JSON.parse(localStorage.getItem("data")); // Get data from localStorage or null if not exists
    if (data == null) {
      // or undefined
      data = await fetchAllDummyJSON();

      localStorage.setItem("data", JSON.stringify(data)); // Store data in localStorage
    }

    users = data.users;
    posts = data.posts;
    comments = data.comments;
  } catch (error) {
    
    console.error("Error while fetching: " + error.message + " Rethrowing to fetchData.");
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
    error.message = "Error while fetching data from DummyJSON API: " + error.message;
    throw error;
  }
}



// -------- Call when loading page ----------------------------------------------------

/**
 * Calls {@link fetchData} to fetch data and {@link renderPosts} to render it in a posts div on a webpage.
 */
export async function onPageLoad() {
  try {
    if (users == null || comments == null || posts == null) {
      // or undefined
      await fetchData();
    }
    renderPosts();
  } catch (error) {
    console.error("Error while loading page: ", error.message);
  }
}

export function removeData() {
  users = null;
  comments = null;
  posts = null;
}

// Call onPageLoad to initiate loading the page.
onPageLoad();
