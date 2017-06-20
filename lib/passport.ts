const LocalStrategy = require('passport-local').Strategy;
const Joi = require('joi');
const Boom = require('boom');

import Log from './logger';
import Users from './models/users';
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

// Check if datas respect the signup restrictions, and the email and username availability
function verifySignup(data: any): Promise<any> {
	return new Promise((resolve: any,reject: any) => {
		// Check form datas validity
		Joi.validate(data, signupSchema, { abortEarly: false }, (err: any) => {
			if(err)
				return reject(joiErrorStringify(err));
			
			// Check email availability
			Users.findOne({
				'email' :  data.email 
			}).then((user: any) => {
				if(user)
					reject('mailAlreadyTaken');

				// Check username availability
				Users.findOne({ 
					'username' :  data.username 
				}).then((user: any) => {
					if(user)
						reject('usernameAlreadyTaken');

					resolve(data);
				}).catch((err: any) => {
					Log.error('databaseError', err);
					Boom.serverUnavailable('databaseError');
				});
			}).catch((err: any) => {
				Log.error('databaseError', err);
				Boom.serverUnavailable('databaseError');
			});
		});
	});
}

function setupLocalStrategy(passport: any) {

	passport.serializeUser((user: any, done: any) => {
		done(null, user.id);
	});

	passport.deserializeUser((id: any, done: any) => {
		Users.findById(id, (err: any, user: any) => {
			done(err, user);
		});
	});

	// Passport Signup
	passport.use('local-signup', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, (request: any, email: any, password: any, next: any) => {
		verifySignup(request.body).then((data) => {
			var newUser = new Users();

			newUser.email = data.email;
			newUser.username = data.username;
			newUser.password = newUser.generateHash(data.password);
			newUser.language = request.session.language;

			newUser.save((err: any) => {
				if(err) next(Boom.serverUnavailable('databaseError'));

				request.session.user = newUser.toPublicObject();

				next(null, newUser);
			});
		}).catch((err: any) => {
			next(null, false, request.flash('signupError', err));
		});  
	}));

	// Passport Login
	passport.use('local-login', new LocalStrategy({
		usernameField : 'email',
		passwordField : 'password',
		passReqToCallback : true
	}, function(request: any, email: any, password: any, next: any) {

		Users.findOne({ 'email' :  email }, function(err: any, user: any) {
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