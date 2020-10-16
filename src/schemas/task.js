const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const { Schema } = mongoose;

const taskSchema = new Schema({
	description: { 
		type: String, 
		unique: true, 
		required: [true, 'description is required']
	},
	completed: { 
		type: Boolean, 
		default: false 
	}
}, { strict: false });

taskSchema.plugin(uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Task', taskSchema);