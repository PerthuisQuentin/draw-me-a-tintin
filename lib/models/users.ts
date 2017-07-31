import * as Mongoose from 'mongoose';
import * as Bcrypt from 'bcrypt';
import * as Moment from 'moment';
import { Promise } from 'ts-promise';

import config from '../config';
import { generateToken, websitePathJoin } from '../utils';
import { sendActivationMail, IActivationContext } from '../mailer';
 
export enum UserStatut {
    New = "new",
    Active = "active"
}

export interface IUser {
	email?: string,
	username?: string,
	language?: string,
	admin?: boolean
}

export interface IUserSession extends IUser {
	statut: UserStatut
}

export interface IUserModel extends IUser, Mongoose.Document {
	password?: string,
	statut: UserStatut,
	activationToken: string,
	activationExpiration: Date,
	verifyPassword(password: string): Promise<boolean>,
	toPublicObject(): IUser,
	toSession(): IUserSession
}


var userSchema: Mongoose.Schema = new Mongoose.Schema({
	email: String,
	username: String,
	password: String,
	statut: {
		type: String, 
		default: UserStatut.New 
	},
	language: { 
		type: String, 
		default: config.language.default 
	},
	admin: { 
		type: Boolean, 
		default: false 
	},
	activationToken: String,
	activationExpiration: Date
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

userSchema.methods.toSession = function(): IUserSession {
	return {
		email: this.email,
		username: this.username,
		language: this.language,
		statut: this.statut,
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

userSchema.methods.initActivationProcess = function(): Promise<void> {
	return new Promise<void>((resolve, reject) => {
		this.activationToken = generateToken();
		this.activationExpiration = Moment(Moment.now()).add(10, 'minutes').toDate();

		this.save()
		.then(() => {
			let mailContext: IActivationContext = {
				name: this.username,
				url: websitePathJoin('activate', this.activationToken)
			};

			sendActivationMail(
				this.email,
				this.language,
				mailContext
			)
			.then(() => {
				resolve(undefined);
			})
			.catch(reject);
		})
		.catch(reject);
	});
};

export const Users: Mongoose.Model<IUserModel> = Mongoose.model<IUserModel>('User', userSchema);