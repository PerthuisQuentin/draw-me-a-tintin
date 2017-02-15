"use strict";

// Load modules

const Fs = require('fs');

const Config = rootRequire('src/config').config;
const Log = rootRequire('src/logger');



var images = JSON.parse(Fs.readFileSync(Config.paths.imageList));

function indexHandler(request, reply) {
	reply.view('index', {
        images: images
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