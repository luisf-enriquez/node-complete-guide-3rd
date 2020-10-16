const express =  require('express');
const expressJoi = require('express-joi-validator');
const router =  express.Router();
const controller =  require('../controllers/user');
const schema =  require('../../config/validators');

router.get('/user/:id', expressJoi(schema.getTask), (req, res) => {
    controller.getUserById(req, res);
})

router.get('/user', (req, res) => {
    controller.getAll(req, res);
})

router.post('/user', expressJoi(schema.addUser), (req, res) => {
    controller.createUser(req, res);
})

router.put('/user/:id', expressJoi(schema.updateUser), (req, res) => {
    controller.updateUser(req, res);
});

router.delete('/user/:id', (req, res) => {
    controller.deleteUser(req, res);
});

module.exports = router;