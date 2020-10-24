const mongoose = require('mongoose');
const config = require('../../config/config');
const connectMongoDB = () => {
    return new Promise((resolve, reject) => {
        mongoose.connect(process.env.MONGODB_URL, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false}, (err, res) => {
            if (err) {
                reject(err);
            }
            resolve('-------------- Database Online --------------');
        });   
    })   
};

module.exports = {connectMongoDB};