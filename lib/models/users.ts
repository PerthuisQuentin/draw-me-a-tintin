import * as Mongoose from 'mongoose';
import * as Bcrypt from 'bcrypt';

import config from '../config';

export interface IUser {
	email?: string,
	username?: string,
	language?: string,
	admin?: boolean
}

export interface IUserModel extends IUser, Mongoose.Document {
    password?: String,
	generateHash(password: string): string;
	validPassword(password: string): boolean;
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

userSchema.methods.toPublicObject = function(): IUser {
	return {
		email: this.email,
		username: this.username,
		language: this.language,
		admin: this.admin
	};
};

// Hash the password
userSchema.methods.generateHash = function(password: string): string {
	return Bcrypt.hashSync(password, Bcrypt.genSaltSync(8));
};

// Checking if password is valid
userSchema.methods.validPassword = function(password: string): boolean {
	return Bcrypt.compareSync(password, this.password);
};

export const Users: Mongoose.Model<IUserModel> = Mongoose.model<IUserModel>('User', userSchema);