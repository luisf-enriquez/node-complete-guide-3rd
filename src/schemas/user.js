const mongoose = require('mongoose');
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');
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
    }
}, { strict: false });

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' });

module.exports = mongoose.model('User', userSchema);