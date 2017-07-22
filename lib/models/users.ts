import * as Mongoose from 'mongoose';
import * as Bcrypt from 'bcrypt';
import { Promise } from 'ts-promise';

import config from '../config';

export interface IUser {
	email?: string,
	username?: string,
	language?: string,
	admin?: boolean
}

export interface IUserModel extends IUser, Mongoose.Document {
	password?: String,
	verifyPassword(password: string): Promise<boolean>;
	toPublicObject(): IUser;
}

var userSchema: Mongoose.Schema = new Mongoose.Schema({
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

// Automatically hash the password if modified
userSchema.pre('save', function(next) {
	var user: IUserModel = this;

	if(!user.isModified('password')) return next();

  	Bcrypt.genSalt(config.security.passwordSaltFactor, function(err, salt) {
    	if(err) return next(err);

    	Bcrypt.hash(user.password, salt, function(err, hash) {
			if (err) return next(err);
			user.password = hash;
			next();
		});
	});
});

userSchema.methods.toPublicObject = function(): IUser {
	return {
		email: this.email,
		username: this.username,
		language: this.language,
		admin: this.admin
	};
};

// Check if password is valid
userSchema.methods.verifyPassword = function(password: string): Promise<boolean> {
	return new Promise<boolean>((resolve, reject) => {
		Bcrypt.compare(password, this.password, function(err, isValid) {
			if(err) return reject(err);

			resolve(isValid);
		});
	});
};

export const Users: Mongoose.Model<IUserModel> = Mongoose.model<IUserModel>('User', userSchema);