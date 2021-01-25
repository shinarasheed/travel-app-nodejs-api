const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name!'],
  },
  email: {
    type: String,
    required: [true, 'Please provide your email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
  },
  confirmPassword: {
    type: String,
    required: [true, 'Please confirm password'],
    minlength: 8,
    validate: {
      //this only happens on save() and on create() meaning we cannot expect this to happen when we use findOneAndUpdate. its then best to use save() for update
      validator: function (el) {
        return el === this.password;
      },
      message: 'Passwords are not thesame',
    },
  },
});

userSchema.pre('save', async function (next) {
  //we only want to hash the password if it is been modified
  //like during signup and password reset and password change
  //but we do not want to hash when user in updating other info
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  this.confirmPassword = undefined;
  next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;
