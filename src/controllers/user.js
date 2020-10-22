const mongoModel = require('../models/user');
const utils = require('../../config/utils');
const sharp = require('sharp');

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

module.exports.getProfile = async (req, res) => {
    try {
        utils.buildResponse(res, 200, req.user, 'Users fetched');
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
        let { _id } = req.user;
        let result =  await mongoModel.updateById(_id, req.body);
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
        // there are two ways to ensuer that when a suer is deleted its tasks would be
        // deleted as well:

        // 1. the first one is to delete all the tasks that are related to the user 
        // directly with a query to the Task.deleteMany({id: userId})

        // 2. to use the middleware that mongoose provides, when the "remove" method is called

        // const result = await mongoModel.deleteById(req.user._id)
        await req.user.remove();
        return utils.buildResponse(res, 200, req.user, 'User deleted succesfully');
    } catch (error) {
        return utils.buildResponse(res, 500, error, 'An error ocurred while deleting user');
    }
};

module.exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user =  await mongoModel.findByCredentials(email, password);
        return utils.buildResponse(res, 200, user, 'Logged Succesfully');
    } catch (error) {
        return utils.buildResponse(res, 400, [], error.message);
    }
};

module.exports.logOutUser = async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((t) => t.token !== req.token);
        await req.user.save();
        return utils.buildResponse(res, 200, [], 'User logged out succesfully');
    } catch (error) {
        console.log(error);
        return utils.buildResponse(res, 500, [], error.message);
    }
};

module.exports.logOutAll = async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();
        return utils.buildResponse(res, 200, [], 'User logged out succesfully From all devices');
    } catch (error) {
        return utils.buildResponse(res, 500, [], error.message);
    }
};

module.exports.uplodaAvatar = async (req, res) => {
    try {
        if (!req.file) {
            return utils.buildResponse(res, 400, {}, 'An image need to be attached');
        }
        const buffer = await sharp(req.file.buffer).png().resize({ width: 250, height: 250 }).toBuffer();
        req.user.fileExtension = req.file.originalname.split('.')[1];
        req.user.avatar = buffer;
        await req.user.save();
        return utils.buildResponse(res, 200, {}, 'File Uploaded');
    } catch (error) {
        console.log(error);
    }
};

module.exports.deleteAvatar = async (req, res) => {
    try {
        // delete req.user.avatar;
        req.user.avatar = null;
        await req.user.save();
        return utils.buildResponse(res, 200, {}, 'Avatar deleted');
    } catch (error) {
        console.log(error);
        return utils.buildResponse(res, 500, {}, error);
    }
};

// controller to return the URL to acces the image stored for the user profile
module.exports.getAvatar = async (req, res) => {
    try {
        const user = await mongoModel.getUser(req.params.id);
        if (user === null) {
            return utils.buildResponse(res, 404 , {}, 'The user with the given ID does not exist');
        } else if (!user.avatar) {
            return utils.buildResponse(res, 404 , {}, 'The user with the given ID does not have an avatar');
        }

        // set the content-type to indicate express that we are sending an image instead of JSON

        res.set('Content-Type', `image/png`);
        return res.status(200).send(user.avatar);
    } catch (error) {
        console.log(error);
        return utils.buildResponse(res, 404, {}, error);
    }
};