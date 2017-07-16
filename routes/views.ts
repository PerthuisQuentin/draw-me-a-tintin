import * as Express from 'express';

import Log from '../lib/logger';
import images from '../lib/images';
import { 
	setupViewsLocals
} from '../lib/middleware';

var router = Express.Router();

router.use(setupViewsLocals);

// Index
router.get('/', function(request: Express.Request, response: Express.Response) {
	response.render('index', request.locals);
});

Log.verbose('Loaded : [VIEW][GET] /');



// Login
router.get('/login', function(request: Express.Request, response: Express.Response) {
	request.locals.message = request.flash('loginMessage');
	
	response.render('login', request.locals);
});

Log.verbose('Loaded : [VIEW][GET] /login');



// Signup
router.get('/signup', function(request: Express.Request, response: Express.Response) {
	request.locals.styles = ['signup.css'];
	request.locals.scripts = ['signup.js'];
	request.locals.message = request.flash('signupError');

	response.render('signup', request.locals);
});

Log.verbose('Loaded : [VIEW][GET] /signup');



// Proposals
router.get('/proposals', function(request: Express.Request, response: Express.Response) {
	response.render('proposals', request.locals);
});

Log.verbose('Loaded : [VIEW][GET] /proposals');



// Proposals
router.get('/gallery', function(request: Express.Request, response: Express.Response) {
	request.locals.styles = ['gallery.css'];
	request.locals.scripts = ['gallery.js'];
	request.locals.images = images;

	response.render('gallery', request.locals);
});

Log.verbose('Loaded : [VIEW][GET] /gallery');



export default router;