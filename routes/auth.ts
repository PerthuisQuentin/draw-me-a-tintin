import * as Express from 'express';
import * as Passport from 'passport';
import * as Boom from 'boom';

import { IUser } from '../lib/models/users';
import { setupViewsLocals } from '../lib/middleware';
import { HttpError } from '../lib/utils';

function setupAuth(passport: Passport.Passport) {
	var router = Express.Router();

	router.use(setupViewsLocals);

	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	router.post('/login', function(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
		passport.authenticate('local-login', function(error: HttpError, user: IUser, info: any) {
			if(error) {
				request.locals.error = error;
				return response.render('error', request.locals);
			}

			if(!user) {
				request.flash('login', info);
				return response.redirect('/login');
			}

			request.login(user, (loginError) => {
				if (loginError) {
					request.locals.error = HttpError.internalError()
					return response.render('error', request.locals);
				}
			
				response.redirect('/');
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