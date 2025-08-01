const express = require('express');
const { registerUser, loginUserController } = require('../controller/user.controller');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUserController);

module.exports = router;
