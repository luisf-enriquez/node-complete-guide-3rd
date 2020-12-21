const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../../src/schemas/user');
const Task = require('../../src/schemas/task');

const userOneId = new mongoose.Types.ObjectId()
const userOne = {
    _id: userOneId,
    name: 'Fernando',
    email: 'fernando@gmail.com',
    password: bcrypt.hashSync('myuserpass',10),
    tokens: [
        {
            token: jwt.sign({ payload: { _id: userOneId } }, process.env.JWT_SECRET)
        }
    ]
};

const userTwoId = new mongoose.Types.ObjectId()
const userTwo = {
    _id: userTwoId,
    name: 'Juan',
    email: 'juan@gmail.com',
    password: bcrypt.hashSync('mysecondpass', 10),
    tokens: [
        {
            token: jwt.sign({ payload: { _id: userTwoId } }, process.env.JWT_SECRET)
        }
    ]
};

const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: 'First task from test',
    completed: false,
    user: userOneId
};

const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Second task from test',
    completed: true,
    user: userOneId
};

const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: 'Third task from test',
    completed: true,
    user: userTwoId
};

const setUpDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save()
    await new User(userTwo).save()
    await new Task(taskOne).save()
    await new Task(taskTwo).save() 
    await new Task(taskThree).save()
};

module.exports = {
    userOneId,
    userOne,
    userTwo,
    taskOne,
    taskTwo,
    taskThree,
    setUpDatabase
}