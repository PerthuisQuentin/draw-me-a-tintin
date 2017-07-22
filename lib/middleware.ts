import * as Express from 'express';
import config from './config';

export function setupViewsLocals(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
	if(request.locals === undefined)
		request.locals = {};

	// Website title
	request.locals.title = config.website.title;

	// Passeport authentification
	request.locals.isAuthenticated = request.isAuthenticated();

	// User informations
	request.locals.user = request.session.user;

	// Locale
	request.locals.locale = request.locale;

	next();
}