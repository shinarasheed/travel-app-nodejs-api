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
  photo: String,
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
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
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user',
  },
  passwordChangedAt: Date,
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

userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword
) {
  //we are doing it this way since the password is no longer available
  return bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );

    //password changed
    return JWTTimestamp < changedTimestamp;
  }
  //false means not changed
  return false;
};

const User = mongoose.model('User', userSchema);
module.exports = User;
