/**
 * A class containing the properties of a comment.
 * @class Comment
 */
export class Comment {
  constructor(id, body, postId, userData) {
    this.id = id;
    this.body = body;
    this.likes = 0;
    this.postId = postId;
    this.user = userData;
  }
}
