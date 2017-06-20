const Express = require('express');

function setupAuth(passport: any) {
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

	router.get('/logout', function(request: any, response: any) {
		request.logout();
		response.redirect('/');
	});

	return router;
}

export default setupAuth;