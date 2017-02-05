"use strict";

const Config = require('src/config.js');

module.exports = {
	method: 'GET',
	path: '/script/{path*}',
	handler: {
	    directory: {
	        path: Config.paths.script,
	        listing: false,
	        index: false
	    }
	},
	config: {
		description: 'Script',
        tags: ['api', 'ressources', 'script']
	}
};