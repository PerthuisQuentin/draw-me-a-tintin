import * as Express from 'express';
import config from './config';

export function setupViewsLocals(request: Express.Request, response: Express.Response, next: Express.NextFunction) {
	if(request.locals === undefined)
		request.locals = {};

	// Website title
	request.locals.title = config.website.title;

	// Passeport authentification
	request.locals.isAuthenticated = request.isAuthenticated();

	// Locale
	request.locals.locale = request.locale;

	next();
}