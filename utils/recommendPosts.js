const Post = require('../models/Post');

async function recommendPosts(userId) {
  try {
    // Fetch posts excluding the user's own
    let posts = await Post.find({ user: { $ne: userId } })
                          .populate('user', 'username')
                          .lean();

    // Basic recommendation logic: sort by the number of stars and comments
    posts.sort((a, b) => {
      const scoreA = a.stars + a.comments.length;
      const scoreB = b.stars + b.comments.length;
      return scoreB - scoreA; // Descending order
    });

    // For simplicity, we return top 10 posts
    const recommendedPosts = posts.slice(0, 10);
    console.log("Recommended posts fetched successfully.");
    return recommendedPosts;
  } catch (error) {
    console.error('Error fetching recommended posts:', error.message, error.stack);
    throw error;
  }
}

module.exports = recommendPosts;