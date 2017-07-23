import { 
	Request,
	Response,
	NextFunction,
	Errback
} from 'express';

import { HttpError } from './utils';
import config from './config';

export function setupViewsLocals(request: Request, response: Response, next: NextFunction) {
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