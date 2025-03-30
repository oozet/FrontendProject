/**
 * A class containing the properties of a post.
 * @class Post
 */
export class Post {
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
