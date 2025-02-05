const express = require('express');
const router = express.Router();
const { signup, signin, google,forgotPassword,resetPassword,updatePassword } = require('../controller/auth_controller.js');

router.post('/signin', signin);
router.post('/signup', signup);
router.post('/google', google);
router.post("/forgot-password", forgotPassword);
router.get('/reset-password/:id/:token', resetPassword);
router.post('/reset-password/:id/:token', updatePassword); 


module.exports = router;