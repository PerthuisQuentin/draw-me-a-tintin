"use strict";

// Load modules

const Bcrypt = require('bcrypt');
const Boom = require('boom');

const Config = rootRequire('src/config').config;
const Log = rootRequire('src/logger');



const ADMIN_KEY = process.env.DRAW_ME_KEY;

if(!ADMIN_KEY) {
	Log.error("Can't find environnement variable DRAW_ME_KEY");
	process.exit(1);
}

function adminHandler(request, reply) {
	Bcrypt.compare(request.params.key, ADMIN_KEY, function(err, res) {
    	if(err) return reply(Boom.badImplementation(err));
    	
    	if(res) {
    		reply.view('admin');
    	} else {
    		return reply(Boom.badRequest("Bad key"));
    	}
	});	
}

module.exports = {
	method: 'GET',
	path: '/admin/{key}',
	handler: adminHandler,
	config: {
		description: 'Index',
        tags: ['index']
	}
};