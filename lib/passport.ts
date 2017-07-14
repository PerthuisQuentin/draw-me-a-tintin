import * as Passport from 'passport';
import * as PassportLocal from 'passport-local';
import * as Joi from 'joi';
import * as Boom from 'boom';
import * as Promise from 'bluebird';
import * as Express from 'express';

import Log from './logger';
import { Users, IUserModel } from './models/users';
import { joiErrorStringify } from './utils';
 
const signupSchema = Joi.object().keys({
	email: Joi
		.string()
		.email()
		.required(),
	username: Joi
		.string()
		.alphanum()
		.min(3).max(32)
		.required(),
	password: Joi
		.string()
		.min(3).max(64)
		.required()
});

interface ISignup {
	email?: string,
	username?: string,
	password?: string
}

// Check if datas respect the signup restrictions, and the email and username availability
function verifySignup(data: ISignup): Promise<ISignup> {
	return new Promise((resolve, reject) => {
		// Check form datas validity
		Joi.validate(data, signupSchema, { abortEarly: false }, (err: any) => {
			if(err)
				return reject(joiErrorStringify(err));
			
			// Check email availability
			Users.findOne({
				'email' :  data.email 
			}).then((user: IUserModel) => {
				if(user)
					return reject(Boom.wrap(new Error('mailAlreadyTaken'), 412, 'mailAlreadyTaken'));

				// Check username availability
				Users.findOne({ 
					'username' :  data.username
				}).then((user: IUserModel) => {
					if(user)
						return reject(Boom.wrap(new Error('usernameAlreadyTaken'), 412, 'usernameAlreadyTaken'));

					resolve(data);

				}).catch((err) => {
					Log.error('databaseError', err);
					reject(Boom.wrap(err, 503, 'databaseError'));
					
				});
			}).catch((err) => {
				Log.error('databaseError', err);
				reject(Boom.wrap(err, 503, 'databaseError'));
			});
		});
	});
}

function setupLocalStrategy(passport: Passport.Passport) {

	passport.serializeUser((user: IUserModel, done) => {
		done(null, user.id);
	});

	passport.deserializeUser((id: string, done) => {
		Users.findById(id, (err, user: IUserModel) => {
			done(err, user);
		});
	});

	// Passport Signup
	passport.use('local-signup', new PassportLocal.Strategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, (request: Express.Request, email: string, password: string, next) => {
		verifySignup(request.body).then((data: ISignup) => {
			var newUser = new Users();

			newUser.email = data.email;
			newUser.username = data.username;
			newUser.password = newUser.generateHash(data.password);
			newUser.language = request.session.language;

			newUser.save((err) => {
				if(err) 
					return next(null, false, Boom.wrap(err, 503, 'databaseError'));

				request.session.user = newUser.toPublicObject();

				next(null, newUser);
			});
		}).catch((err) => {
			next(null, false, request.flash('signupError', err));
		});  
	}));

	// Passport Login
	passport.use('local-login', new PassportLocal.Strategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function(request: Express.Request, email: string, password: string, next) {

		Users.findOne({ 'email' :  email }, function(err, user: IUserModel) {
			if(err) return next(err);

			if(!user) 
				return next(null, false, request.flash('loginMessage', 'No user found.'));

			if(!user.validPassword(password))
				return next(null, false, request.flash('loginMessage', 'Wrong password.'));

			request.session.user = user.toPublicObject();

			return next(null, user);
		});
	}));
}

export default setupLocalStrategy;