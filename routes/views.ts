const Express = require('express');

import Log from '../lib/logger';
import images from '../lib/images';

var router = Express.Router();

// Index
router.get("/", function(request: any, response: any) {
    response.render("index");
});

Log.verbose('Loaded : [VIEW][GET] /');


// Login
router.get("/login", function(request: any, response: any) {
    response.render("login", {
        message: request.flash('loginMessage')
    });
});

Log.verbose('Loaded : [VIEW][GET] /login');


// Signup
router.get("/signup", function(request: any, response: any) {
    response.render("signup", {
        message: request.flash('signupMessage')
    });
});

Log.verbose('Loaded : [VIEW][GET] /signup');


// Proposals
router.get("/proposals", function(request: any, response: any) {
    response.render("proposals");
});

Log.verbose('Loaded : [VIEW][GET] /proposals');



// Proposals
router.get("/gallery", function(request: any, response: any) {
    response.render("gallery", {
        styles: [
            'gallery.css'
        ],
        scripts: [
            'gallery.js'
        ],
        images: images
    });
});

Log.verbose('Loaded : [VIEW][GET] /gallery');

export default router;