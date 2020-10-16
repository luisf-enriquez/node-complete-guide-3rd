const mongoModel = require('../models/user');
const utils = require('../../config/utils');
const { mongo } = require('mongoose');
module.exports.createUser = async (req, res) => {
    try {
        let { body } = req;
        const result =  await mongoModel.addUser(body);
        return utils.buildResponse(res, 201, result, 'User created succesfully');
    } catch (error) {
        return res.status(400).json({
            status: 400,
            error: error.message, 
            message: 'An error ocured during user creation' });
    }
};

module.exports.getAll = async (req, res) => {
    try {
        const result = await mongoModel.getAllUsers();
        utils.buildResponse(res, 200, result, 'Users fetched');
    } catch (error) {
        console.log(error)
        utils.buildResponse(res, 500, error, 'Internal server error');
    }
}

module.exports.getUserById = async (req, res) => {
    try {
        let { id } =  req.params
        const result = await mongoModel.getUser(id);
        if (result === null) {
            return utils.buildResponse(res, 404 , result, 'The user with the given ID does not exist');
        }
        return utils.buildResponse(res, 200, result, 'User fetched succesfully');
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return utils.buildResponse(res, 500, {error}, 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')
        }
        return utils.buildResponse(res, 500, {error}, 'An error ocurred while fetching user');
    }
};

module.exports.updateUser = async (req, res) => {
    try {
        let { id } = req.params;
        let result =  await mongoModel.updateById(id, req.body);
        if (result === null) {
            return utils.buildResponse(res, 404, result, 'The user with the given ID does not exist');
        }
        return utils.buildResponse(res, 200, result, 'User updated succesfully');
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return utils.buildResponse(res, 500, {error}, 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')
        }
        return utils.buildResponse(res, 500, error, 'An error ocurred while updating user');
    }
};

module.exports.deleteUser = async (req, res) => {
    try {
        const result = await mongoModel.deleteById(req.params.id)
        if (result === null) {
            return utils.buildResponse(res, 404, result, 'The user with the given ID does not exist');
        }
        return utils.buildResponse(res, 200, result, 'User deleted succesfully');
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return utils.buildResponse(res, 500, {error}, 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters')
        }
        return utils.buildResponse(res, 500, error, 'An error ocurred while deleting user');
    }
}