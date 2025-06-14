const express = require('express');
const router = express.Router();
const { register, login, logOut, updateProfile, getAllUsers } = require('../controllers/user.controller.js');
const { singleUpload } = require('../middleware/multer.js');
const { isAuth } = require('../middleware/isAuth.js');

router.post('/register', register);
router.post('/login', login);
router.get('/logout', logOut);

router.put('/profile/update', isAuth, singleUpload, updateProfile);
router.get('/all-users', getAllUsers);

module.exports=router;
