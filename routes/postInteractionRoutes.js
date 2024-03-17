const express = require('express');
const Post = require('../models/Post');
const { isAuthenticated } = require('./middleware/authMiddleware');
const router = express.Router();

// Route to star a post
router.post('/post/star/:postId', isAuthenticated, async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findByIdAndUpdate(postId, { $inc: { stars: 1 } }, { new: true });
    console.log(`Post ${postId} starred successfully.`);
    res.json({ success: true, stars: post.stars });
  } catch (error) {
    console.error('Error starring post:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error starring post', error: error.message });
  }
});

// Route to add a comment to a post
router.post('/post/comment/:postId', isAuthenticated, async (req, res) => {
  try {
    const { comment } = req.body;
    const postId = req.params.postId;
    const userId = req.session.userId;
    const newComment = { user: userId, content: comment };

    const updatedPost = await Post.findByIdAndUpdate(postId, { $push: { comments: newComment } }, { new: true });
    console.log(`Comment added to post ${postId} by user ${userId}.`);
    res.json({ success: true, comment: newComment, comments: updatedPost.comments });
  } catch (error) {
    console.error('Error adding comment:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error adding comment', error: error.message });
  }
});

// Route to repost a post
router.post('/post/repost/:postId', isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.session.userId;

    const originalPost = await Post.findById(postId);
    if (!originalPost) {
      return res.status(404).json({ success: false, message: 'Original post not found' });
    }

    await Post.create({
      content: originalPost.content,
      user: userId,
      originalPost: originalPost._id
    });

    console.log(`Post ${postId} reposted successfully.`);
    res.json({ success: true, message: 'Post reposted successfully' });
  } catch (error) {
    console.error('Error reposting post:', error.message, error.stack);
    res.status(500).json({ success: false, message: 'Error reposting post', error: error.message });
  }
});

module.exports = router;