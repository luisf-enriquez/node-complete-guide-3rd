const mongoose = require('mongoose');
const validator = require('validator');
const moment = require('moment-timezone');
const uniqueValidator = require('mongoose-unique-validator');
const Task = require('./task');
const { Schema } = mongoose;

const userSchema = new Schema({
    name: { 
        type: String, 
        required: true,
        trim: true,
        required: [true, 'name is required']
    },
    age: { 
        type: Number, 
        default: 0,
        validate(value){
            if (value < 0) {
                throw new Error ('age must be a positive number');
            }
        }
    },
    email: {
        type: String,
        required: [true, 'email is required'],
        trim: true,
        lowercase: true,
        unique: true,
        validate(value){
            if (!validator.isEmail(value)) {
                throw new Error ('Email is invalid');
            }
        }
    },
    password: {
        type: String,
        required: [true, 'password is required'],
        minlength:7,
        trim: true,
        validate(value){
            if (value.toLowerCase().includes('password')) {
                throw new Error ('Password can not contain "password"');
            }
        }
    },
    tokens: [{ // this is an array of objects with the given keys, we wnat to track tje tokens for the user
        token: {
            type: String,
            required: true
        }
    }],
    avatar: { type: Buffer },
    fileExtension: { type: String, default: null }
}, { 
    strict: false, toJSON: { virtuals: true }, toObject: { virtuals:true },
    timestamps: true
});

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

// this is a property we are adding to our schema but actually we are not storing it in the DB
// it allows to create realtionships as we do in relational databases

userSchema.virtual('tasks', {
    ref: 'Task',
    localField: '_id',
    foreignField: 'user'
});

// we dont want the password to be visible in the response when logged in
// this method is called whenever the res.send res.json method of the response object is called
// in an instance of this user model
userSchema.methods.toJSON = function () {
	let user =  this;
	let userObject = user.toObject();
    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;
	return userObject;
};

// Delete user tasks when user is deleted THIS IS A MIDDLEWARE
userSchema.pre('remove', async function(next){
    self = this;
    await Task.deleteMany({ user: self._id });
    next();
});

module.exports = mongoose.model('User', userSchema);