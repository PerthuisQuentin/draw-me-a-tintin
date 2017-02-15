"use strict";

// Load modules

const Config = rootRequire('src/config').config;



module.exports = {
	method: 'GET',
	path: '/style/{path*}',
	handler: {
	    directory: {
	        path: Config.paths.style,
	        listing: false,
	        index: false
	    }
	},
	config: {
		description: 'Style',
        tags: ['api', 'ressources', 'style']
	}
};