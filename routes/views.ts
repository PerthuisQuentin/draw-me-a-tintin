const Express = require('express');

import Log from '../lib/logger';
import images from '../lib/images';
import { addLocals, checkLogin } from '../lib/middleware';

var router = Express.Router();

router.use(addLocals);
router.use(checkLogin);

// Index
router.get("/", function(request: any, response: any) {
    response.render("index", request.locals);
});

Log.verbose('Loaded : [VIEW][GET] /');



// Login
router.get("/login", function(request: any, response: any) {
    request.locals.message = request.flash('loginMessage');
    
    response.render("login", request.locals);
});

Log.verbose('Loaded : [VIEW][GET] /login');



// Signup
router.get("/signup", function(request: any, response: any) {
    request.locals.message = request.flash('signupMessage');

    response.render("signup", request.locals);
});

Log.verbose('Loaded : [VIEW][GET] /signup');



// Proposals
router.get("/proposals", function(request: any, response: any) {
    response.render("proposals", request.locals);
});

Log.verbose('Loaded : [VIEW][GET] /proposals');



// Proposals
router.get("/gallery", function(request: any, response: any) {
    request.locals.styles = ['gallery.css'];
    request.locals.scripts = ['gallery.js'];
    request.locals.images = images;

    response.render("gallery", request.locals);
});

Log.verbose('Loaded : [VIEW][GET] /gallery');



export default router;