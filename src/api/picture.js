"use strict";

// Load modules

const Config = rootRequire('src/config').config;



module.exports = {
	method: 'GET',
	path: '/picture/{path*}',
	handler: {
	    directory: {
	        path: Config.paths.picture,
	        listing: false,
	        index: false
	    }
	},
	config: {
		description: 'Image',
        tags: ['api', 'ressources', 'picture']
	}
};