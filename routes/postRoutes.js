const express = require('express');
const Post = require('../models/Post');
const { isAuthenticated } = require('./middleware/authMiddleware');
const router = express.Router();
const marked = require('marked'); // Import marked for Markdown support

// Route to render post creation form
router.get('/post', isAuthenticated, (req, res) => {
  res.render('createPost');
});

// Route to handle post creation form submission
router.post('/post', isAuthenticated, async (req, res) => {
  try {
    const { content, markdown } = req.body; // Extract markdown checkbox value
    const userId = req.session.userId;
    let markedContent = content;

    if (markdown) {
      markedContent = convertInlineCode(markedContent); // Convert inline code to HTML
      markedContent = convertCodeBlocks(markedContent); // Convert code blocks to HTML
    }

    const post = await Post.create({ content: markedContent, user: userId }); // Save Markdown content
    res.redirect('/');
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).send(error.message);
  }
});

// Route to handle reposting a post
router.post('/post/repost/:postId', isAuthenticated, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.session.userId;

    // Find the original post to repost
    const originalPost = await Post.findById(postId);
    if (!originalPost) {
      return res.status(404).send('Original post not found');
    }

    // Create a new post as a repost of the original
    await Post.create({
      content: originalPost.content,
      user: userId,
      originalPost: originalPost._id,
      inlineCode: originalPost.inlineCode,
      codeBlock: originalPost.codeBlock,
    });

    console.log(`Post ${postId} reposted successfully.`);
    res.redirect('/');
  } catch (error) {
    console.error('Error reposting post:', error.message, error.stack);
    res.status(500).send('Error reposting post');
  }
});

// Implement markdown support for inline code and code blocks
// Function to convert inline code using backticks to <code> tags
function convertInlineCode(content) {
  return content.replace(/`(.*?)`/g, '<code>$1</code>');
}

// Function to convert code blocks using triple backticks to <pre><code> tags
function convertCodeBlocks(content) {
  return content.replace(/```(.*?)```/gs, '<pre><code>$1</code></pre>');
}

module.exports = router;