const Task = require('../schemas/task');

const addTask = async ({description, completed, user}) => {
    let task = new Task({
        description,
        completed,
        user
    });
    return await task.save();
}

const getTask = async (userId, taskId) => {
    return await Task.findOne({ _id: taskId, user: userId });
};

const getAllTasks = async (userId) => {
    return await Task.find({user: userId}).populate('user', 'name email');
};

const updateById =  async (userId, taskId, data) => {
    return await Task.findOneAndUpdate({ _id: taskId, user: userId }, data, { new: true, runValidators: true, context: 'query'});
};

const deleteById = async (userId, taskId) => {
    return await Task.findOneAndDelete({ _id: taskId, user: userId });
}

module.exports = {
    addTask,
    getTask,
    getAllTasks,
    updateById,
    deleteById
}