const Task = require('../schemas/task');

const addTask = async ({description, completed}) => {
    let task = new Task({
        description,
        completed
    });
    return await task.save();
}

const getTask = async (id) => {
    return await Task.findById(id);
};

const getAllTasks = async () => {
    return await Task.find({});
};

const updateById =  async (id, data) => {
    return await Task.findByIdAndUpdate(id, data, { new: true, runValidators: true, context: 'query'});
}

module.exports = {
    addTask,
    getTask,
    getAllTasks,
    updateById
}