import * as Express from 'express';
import * as Passport from 'passport';
import * as Boom from 'boom';

import { IUser } from '../lib/models/users';
import { setupViewsLocals } from '../lib/middleware';
import { CustomError, HttpError, DataError } from '../lib/utils';

function setupAuth(passport: Passport.Passport) {
	var router = Express.Router();

	router.use(setupViewsLocals);

	router.post('/signup', function(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
		passport.authenticate('local-signup', function(error: CustomError, user: IUser, info: any) {
			if(error) {
				request.locals.error = error;

				if(error.type == 'http') {
					return response.render('error', request.locals);

				} else if(error.type == 'data') {
					var dataError = <DataError>error;
					request.locals.previousFields = request.body;

					if(error.message == 'joiError') {
						request.locals.joiError = dataError.data;
					} else if(error.message == 'availabilityError') {
						request.locals.availabilityError = dataError.data;
					}

					request.locals.styles = ['signup.css'];
					request.locals.scripts = ['signup.js'];
					return response.render('signup', request.locals);
				}
			}
			response.redirect('/');

		})(request, response, next);
	});

	router.post('/login', function(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
		passport.authenticate('local-login', function(error: CustomError, user: IUser, info: any) {
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

	router.get('/logout', function(request: Express.Request, response: Express.Response) {
		request.logout();
		response.redirect('/');
	});

	return router;
}

export default setupAuth;