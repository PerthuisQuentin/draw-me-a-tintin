import * as Express from 'express';
import * as Passport from 'passport';

function setupAuth(passport: Passport.Passport) {
	var router = Express.Router();

	router.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/',
		failureRedirect : '/signup',
		failureFlash : true
	}));

	router.post('/login', passport.authenticate('local-login', {
		successRedirect : '/',
		failureRedirect : '/login',
		failureFlash : true
	}));

	router.get('/logout', function(request: Express.Request, response: Express.Response) {
		request.logout();
		response.redirect('/');
	});

	return router;
}

export default setupAuth;