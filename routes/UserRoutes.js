const express = require('express');
const router = express.Router();

const {createUser, login, logout, getUserByIdMiddleware, getAllUsers, getUserById, createAdminUser} = require('../controllers/UserController');
const {create_user_validator, user_login_validator, required_login, is_admin, is_auth} = require('../validators/index');

router.post('/user/create', create_user_validator, createUser);
router.post('/user/admin/create', required_login, is_admin, create_user_validator, createAdminUser);
router.post('/user/login', user_login_validator, login);
router.get('/user/logout', logout);
router.get('/user/all', required_login, is_admin, getAllUsers);
router.get('/user/:userId', required_login, is_auth, getUserById);

//will be called for each url that has userId keyword
router.param("userId", getUserByIdMiddleware)

module.exports = router;