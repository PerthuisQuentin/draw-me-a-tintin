import * as Express from 'express';
import * as Passport from 'passport';

import Views from '../routes/views';
import setupAuth from '../routes/auth';

function setupRouter(passport: Passport.Passport) {
	var router = Express.Router();

	router.use('/', Views);
	router.use('/', setupAuth(passport));

	return router;
}

export default setupRouter;