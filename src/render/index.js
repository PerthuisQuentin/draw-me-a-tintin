"use strict";

// Load modules

const Fs = require('fs');

const Config = rootRequire('src/config').config;
const Log = rootRequire('src/logger');
const Images = rootRequire('src/images');

function indexHandler(request, reply) {
	reply.view('index', {
        images: Images
    });
}

module.exports = {
	method: 'GET',
	path: '/',
	handler: indexHandler,
	config: {
		description: 'Index',
        tags: ['index']
	}
};