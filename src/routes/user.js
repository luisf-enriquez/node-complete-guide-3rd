const express =  require('express');
const expressJoi = require('express-joi-validator');
const router =  express.Router();
const controller =  require('../controllers/user');
const schema =  require('../../config/validators');
const auht = require('../middlewares/auth');
const auth = require('../middlewares/auth');

router.get('/user/:id', expressJoi(schema.getTask), (req, res) => {
    controller.getUserById(req, res);
});

router.get('/users/me', auht, (req, res) => {
    controller.getProfile(req, res);
});

router.post('/user', expressJoi(schema.addUser), (req, res) => {
    controller.createUser(req, res);
});

router.post('/users/login', expressJoi(schema.login), (req, res) => {
    controller.loginUser(req, res);
});

router.post('/users/logout', auth, (req, res) => {
    controller.logOutUser(req, res);
});

router.post('/users/logoutAll', auth, (req, res) => {
    controller.logOutAll(req, res);
});

// since we send the user in the request objet after the midleware, we dont need the id in the route
// to delete a user profile

router.put('/user/me', expressJoi(schema.updateUser), auth, (req, res) => {
    controller.updateUser(req, res);
});

router.delete('/user/me', auth, (req, res) => {
    controller.deleteUser(req, res);
});

module.exports = router;