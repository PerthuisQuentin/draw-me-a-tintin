import * as Passport from 'passport';
import * as PassportLocal from 'passport-local';
import * as Joi from 'joi';
import * as Boom from 'boom';
import * as Express from 'express';
import { Promise } from 'ts-promise';

import Log from './logger';
import { Users, IUserModel } from './models/users';
import { joiErrorStringify, HttpError } from './utils';
 
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
function verifySignupDatas(data: ISignup): Promise<ISignup> {
	return new Promise<ISignup>((resolve, reject) => {
		// Check form datas validity
		Joi.validate(data, signupSchema, { abortEarly: false }, (err: any) => {
			if(err) return reject(Boom.wrap(new Error('badRequest'), 400/*, joiErrorStringify(err)*/));
			

		});
	});
}

function verifyDatasAvailability(data: ISignup) : Promise<ISignup> {
	return new Promise<ISignup>((resolve, reject) => {
		// Check email availability
		Users.findOne({
			'email' :  data.email 
		}).then((user) => {
			if(user)
				return reject(Boom.wrap(new Error('mailAlreadyTaken'), 412, 'mailAlreadyTaken'));

			// Check username availability
			Users.findOne({ 
				'username' :  data.username
			}).then((user) => {
				if(user)
					return reject(Boom.wrap(new Error('usernameAlreadyTaken'), 412, 'usernameAlreadyTaken'));

				resolve(data);

			}).catch((err) => {
				Log.error('databaseError', err);
				reject(Boom.wrap(err, 503, 'databaseError'));
					
			});
		}).catch((err: any) => {
			Log.error('databaseError', err);
			reject(Boom.wrap(err, 503, 'databaseError'));
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
		/*verifySignup(request.body).then((data: ISignup) => {
			var newUser = new Users();

			newUser.email = data.email;
			newUser.username = data.username;
			newUser.password = data.password;
			newUser.language = request.locale;

			newUser.save((err) => {
				if(err) 
					return next(null, false, Boom.wrap(err, 503, 'databaseError'));

				request.session.user = newUser.toPublicObject();

				next(null, newUser);
			});
		}).catch((err) => {
			next(null, false, request.flash('signupError', err.message));
		});  */

		return next(null, false, Boom.wrap(new Error("wala"), 503, 'databaseError'));
	}));

	// Passport Login
	passport.use('local-login', new PassportLocal.Strategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function(request: Express.Request, email: string, password: string, next: any) {

		Users.findOne({
			'email' :  email
		})
		.then((user: IUserModel) => {
			if(!user)
				return next(null, false, 'error.noUserFound');

			user.verifyPassword(password)
			.then((isValid: boolean) => {
				if(!isValid)
					return next(null, false, 'error.wrongPassword');

				request.session.user = user.toPublicObject();

				next(null, user);
			})
			.catch((err) => {
				next(HttpError.internalError());
			});	
		})
		.catch((error: Error) => {
			next(HttpError.databaseError());
		});
	}));
}

export default setupLocalStrategy;