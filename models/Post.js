const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
});

const postSchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  stars: { type: Number, default: 0 },
  comments: [commentSchema],
  inlineCode: { type: String },
  codeBlock: { type: String },
  originalPost: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' }, // Reference to the original post for reposts
});

const Post = mongoose.model('Post', postSchema);

module.exports = Post;