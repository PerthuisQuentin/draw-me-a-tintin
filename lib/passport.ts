import * as Passport from 'passport';
import * as PassportLocal from 'passport-local';
import * as Joi from 'joi';
import * as Boom from 'boom';
import * as Express from 'express';
import * as Async from 'async';
import { Promise } from 'ts-promise';

import Log from './logger';
import { Users, IUserModel } from './models/users';
import { parseJoiError, HttpError, DataError } from './utils';
 
const USERNAME_MIN_LENGTH = 3;
const USERNAME_MAX_LENGTH = 32;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 256;

const mailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

const signupSchema = Joi.object().keys({
	email: Joi
		.string()
		.regex(mailRegex, 'email')
		.required(),
	username: Joi
		.string()
		.alphanum()
		.min(USERNAME_MIN_LENGTH).max(USERNAME_MAX_LENGTH)
		.required(),
	password: Joi
		.string()
		.min(PASSWORD_MIN_LENGTH).max(PASSWORD_MAX_LENGTH)
		.required()
});

interface ISignup {
	email?: string,
	username?: string,
	password?: string
}

enum AvailabilityState {
	Available,
	Taken
}

interface IAvailabilityResult {
	name: string,
	state: AvailabilityState
}

// Check if email and username are availables
function verifyDatasAvailability(data: ISignup) : Promise<ISignup> {
	return new Promise<ISignup>((resolve, reject) => {
		Async.parallel(
			[
				// Check email availability
				function(callback) {
					Users.findOne({
						'email' :  data.email 
					})
					.then((user: IUserModel) => {
						if(user)
							return callback(null, { name: 'email', state: AvailabilityState.Taken });

						return callback(null, { name: 'email', state: AvailabilityState.Available });
					})
					.catch((error) => {
						return callback(HttpError.databaseError());
					});
				},
				// Check username availability
				function(callback) {
					Users.findOne({
						'username' :  data.username
					})
					.then((user: IUserModel) => {
						if(user)
							return callback(null, { name: 'username', state: AvailabilityState.Taken });

						return callback(null, { name: 'username', state: AvailabilityState.Available });
					})
					.catch((error) => {
						return callback(HttpError.databaseError());
					});
				}
			], 
			function(error: Error, results: IAvailabilityResult[]) {
				if(error)
					return reject(error);

				// Email and username available
				if(results.every((result: IAvailabilityResult) => { return result.state === AvailabilityState.Available; })) {
					return resolve(data);
				}

				let dataError: any = {};

				for(let result of results) {
					if(result.state === AvailabilityState.Taken) {
						dataError[result.name] = true;
					}
				}

				return reject(new DataError('availabilityError', dataError));
			}
		);
	});
}

// Check if datas respect the signup restrictions
function verifySignupDatas(data: ISignup): Promise<ISignup> {
	return new Promise<ISignup>((resolve, reject) => {
		// Check form datas validity
		Joi.validate(data, signupSchema, { abortEarly: false }, (error: any) => {
			if(error)
				return reject(new DataError('joiError', parseJoiError(error)));
			
			resolve(data);
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
		verifySignupDatas(request.body)
		.then((verifiedDatas: ISignup) => {	
			verifyDatasAvailability(verifiedDatas)
			.then((availableDatas: ISignup) => {
				var newUser = new Users();

				newUser.email = availableDatas.email;
				newUser.username = availableDatas.username;
				newUser.password = availableDatas.password;
				newUser.language = request.locale;

				newUser.save((error: Error) => {
					if(error) 
						return next(HttpError.databaseError());
		
					next(null, newUser);
				});

				next(HttpError.badRequest());
			})
			.catch((error: DataError) => {
				console.log(error);
				next(error);
			});
		})
		.catch((error: DataError) => {
			next(error);
		});
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

				request.session.user = user.toSession();

				next(null, user);
			})
			.catch((error: Error) => {
				next(HttpError.internalError());
			});	
		})
		.catch((error: Error) => {
			Log.error('databaseError', error);
			next(HttpError.databaseError());
		});
	}));
}

export default setupLocalStrategy;