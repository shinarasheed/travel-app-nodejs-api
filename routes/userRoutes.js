const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { authenticate } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);
//patch is mostly used for update. that's the standard
router.patch('/update-password', authenticate, authController.updatePassword);

router.patch('/updateme', authenticate, userController.updateMe);
router.delete('/deleteme', authenticate, userController.deleteMe);

router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);
router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
