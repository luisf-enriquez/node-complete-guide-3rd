const express =  require('express');
const expressJoi = require('express-joi-validator');
const router =  express.Router();
const controller =  require('../controllers/task');
const schema =  require('../../config/validators');

router.get('/task/:id', expressJoi(schema.getTask), (req, res) => {
    controller.getTaskById(req, res);
});

router.get('/task/', (req, res) => {
    controller.getAll(req, res);
})

router.post('/task', expressJoi(schema.taskSchema), (req, res) => {
    controller.addTask(req, res);
});

router.put('/task:id', expressJoi(schema.updateTask), (req, res) => {
    controller.updateTask(req, res);
});

module.exports = router;