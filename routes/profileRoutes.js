const express = require('express');
const { isAuthenticated } = require('./middleware/authMiddleware');
const User = require('../models/User');
const path = require('path'); // Required for manipulating file paths

const router = express.Router();

// Profile route to render user profile page
router.get('/profile', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }
    res.render('profile', { user });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).send('Error fetching user profile');
  }
});

// Handle profile picture upload
router.post('/profile/avatar', isAuthenticated, async (req, res) => {
  try {
    const userId = req.session.userId;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send('User not found');
    }

    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "avatar") is used to retrieve the uploaded file
    let avatar = req.files.avatar;

    // Construct the upload path using the 'FILE_UPLOAD_DIR' environment variable
    const uploadPath = path.join(process.env.FILE_UPLOAD_DIR, avatar.name);

    // Move the file to the upload directory
    avatar.mv(uploadPath, async function(err) {
      if (err) {
        console.error('File upload error:', err);
        return res.status(500).send(err);
      }

      // Save only the filename in the database to ensure portability
      user.profilePicture = avatar.name;
      await user.save();

      console.log('Profile picture uploaded successfully for user:', user.username);
      res.send('Profile picture uploaded successfully.');
    });
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    res.status(500).send('Error uploading profile picture');
  }
});

module.exports = router;