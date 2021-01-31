const express = require('express');
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const { authenticate, restrictTo } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassword);

//every route after this line are now protected
router.use(authenticate);

router.patch('/update-password', authController.updatePassword);

router.get('/me', userController.getMe, userController.getUser);
router.patch('/updateme', userController.updateMe);
router.delete('/deleteme', userController.deleteMe);

//all the routes under this line is now protected and restricted
router.use(restrictTo('admin'));

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
