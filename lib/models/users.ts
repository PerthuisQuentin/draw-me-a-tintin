const Mongoose = require('mongoose');
const Bcrypt = require('bcrypt');

import config from '../config';

var userSchema = Mongoose.Schema({
	email: String,
	username: String,
	password: String,
	language: { 
		type: String, 
		default: config.language.default 
	},
	admin: { 
		type: Boolean, 
		default: false 
	}
});

userSchema.methods.toPublicObject = function() {
	return {
		email: this.email,
		username: this.username,
		language: this.language,
		admin: this.admin
	};
};

// Hash the password
userSchema.methods.generateHash = function(password: string) {
	return Bcrypt.hashSync(password, Bcrypt.genSaltSync(8), null);
};

// Checking if password is valid
userSchema.methods.validPassword = function(password: string) {
	return Bcrypt.compareSync(password, this.password);
};

export default Mongoose.model('Users', userSchema);