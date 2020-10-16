const express = require('express');
const app = express();

const tasks = require('./task');
const users = require('./user');

app.use('/api/v1', tasks);
app.use('/api/v1', users);

module.exports = app;