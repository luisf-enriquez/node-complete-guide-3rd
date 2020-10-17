const mongoModel = require('../models/task');
const utils = require('../../config/utils');
module.exports.addTask = async (req, res) => {
    try {
        let data = req.body;
        data.user = req.user._id;
        const result = await mongoModel.addTask(data);
        return res.status(201).json({
            status: 201,
            data: result,
            message: 'Registro creado exitosamente'
        });
    } catch (error) {
        return res.status(400).json({
            status: 400,
            error: error.message, 
            message: 'An error ocured during user creation' });
    }
};

module.exports.getAll = async (req, res) => {
    try {
        const result = await mongoModel.getAllTasks(req.user._id);
        // const doc = await req.user.populate('tasks').execPopulate();
        return utils.buildResponse(res, 200, result, 'Tasks fetched');
    } catch (error) {
        console.log(error);
        utils.buildResponse(res, 500, error, 'Internal server error');
    }
}
module.exports.getTaskById = async (req, res) => {
    try {
        const userId =  req.user._id;
        const result = await mongoModel.getTask(userId, req.params.id);
        if (result === null) {
            return utils.buildResponse(res, 404, result, 'The task with the given ID does not exist');
        }
        return utils.buildResponse(res, 200, result, 'Task fetched succesfully');
    } catch (error) {
        return utils.buildResponse(res, 500, {error}, 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')
    }
};

module.exports.updateTask = async (req, res) => {
    try {
        const userId =  req.user._id;
        const result =  await mongoModel.updateById(userId, req.params.id, req.body);
        if (result === null) {
            return utils.buildResponse(res, 404, [], 'The task with the given ID does not exist');
        }
        return utils.buildResponse(res, 200, result, 'Task updated succesfully');
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return utils.buildResponse(res, 500, {error}, 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')
        }
        return utils.buildResponse(res, 500, error, 'An error ocurred while fetching user');
    }
};

module.exports.deleteTask = async (req, res) => {
    try {
        const userId =  req.user._id;
        const result =  await mongoModel.deleteById(userId, req.params.id);
        if (result === null) {
            return utils.buildResponse(res, 404, [], 'The task with the given ID does not exist');
        }
        return utils.buildResponse(res, 200, result, 'Task deleted succesfully');

    } catch (error) {
        if (error.kind === 'ObjectId') {
            return utils.buildResponse(res, 500, {error}, 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')
        }
        return utils.buildResponse(res, 500, error, 'An error ocurred while fetching user'); 
    }
};