import * as Express from 'express';
import * as Passport from 'passport';
import * as Boom from 'boom';

import { IUser } from '../lib/models/users';

function setupAuth(passport: Passport.Passport) {
	var router = Express.Router();

	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	router.post('/login', function(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
		passport.authenticate('local-login', function(err: Error, user: IUser, info: any) {
			if(err) return response.send(Boom.wrap(new Error('usernameAlreadyTaken'), 412, 'usernameAlreadyTaken'));

			if(!user) return response.send(Boom.wrap(new Error('usernameAlreadyTaken'), 412, 'usernameAlreadyTaken'));

			request.login(user, loginErr => {
				if (loginErr) {
					return next(loginErr);
				}
			
				return response.send(Boom.wrap(new Error('usernameAlreadyTaken'), 412, 'usernameAlreadyTaken'));
			});      
		})(request, response, next);
	});

	/*router.post('/login', passport.authenticate('local-login', {
		successRedirect : '/',
		failureRedirect : '/login',
		failureFlash : true
	}));*/

	router.get('/logout', function(request: Express.Request, response: Express.Response) {
		request.logout();
		response.redirect('/');
	});

	return router;
}

export default setupAuth;