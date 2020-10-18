const express =  require('express');
const expressJoi = require('express-joi-validator');
const router =  express.Router();
const controller =  require('../controllers/task');
const schema =  require('../../config/validators');
const auth = require('../middlewares/auth');

router.get('/task/:id', expressJoi(schema.getTask), auth, (req, res) => {
    controller.getTaskById(req, res);
});

router.get('/task', auth, expressJoi(schema.fetchTasks),(req, res) => {
    controller.getAll(req, res);
})

router.post('/task', expressJoi(schema.taskSchema), auth, (req, res) => {
    controller.addTask(req, res);
});

router.put('/task/:id', expressJoi(schema.updateTask), auth, (req, res) => {
    controller.updateTask(req, res);
});

router.delete('/task/:id', auth, (req, res) => {
    controller.deleteTask(req, res);
});

module.exports = router;