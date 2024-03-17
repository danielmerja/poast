const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  profilePicture: { type: String } // Added profilePicture field to the schema
});

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return next(err);
    }
    user.password = hash;
    next();
  });
});

// Log user profile picture upload
userSchema.pre('save', function(next) {
  if (this.isModified('profilePicture')) {
    console.log('Profile picture uploaded for user:', this.username);
  }
  next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;