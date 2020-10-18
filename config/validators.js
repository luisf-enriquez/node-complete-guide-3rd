const Joi = require('joi');

const taskSchema = {
    body: {
        description: Joi.string().required(),
        completed: Joi.boolean().default(false)
    }
};

const getTask = {
    params: {
        id: Joi.string().required(),
    }
};

const addUser = {
    body: {
        name: Joi.string().required(),
        email: Joi.string().required(),
        password: Joi.string().required(),
        age: Joi.number().optional()
    }
};

const updateUser = {
    body: {
        name: Joi.string().optional(),
        email: Joi.string().optional(),
        age: Joi.number().optional(),
        password: Joi.string().optional()
    }
};

const updateTask = {
    body: {
        completed: Joi.boolean().required(),
        description: Joi.string().optional().allow(null, ''),
    }
};

const login = {
    body:{
        email: Joi.string().required(),
        password: Joi.string().required()
    }
};

const fetchTasks = {
    query:{
        completed: Joi.string().optional(),
        limit: Joi.number().default(10),
        skip: Joi.number().default(0), // this skip a certain number of records
        sortBy: Joi.string().optional(),
        asc: Joi.number().default(1)
    }
};

module.exports = {
    taskSchema,
    getTask,
    addUser,
    updateUser,
    updateTask,
    login,
    fetchTasks
}