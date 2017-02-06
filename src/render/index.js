"use strict";

const Fs = require('fs');

const Config = require('src/config.js');
const Log = require('src/logger.js');

var images = JSON.parse(Fs.readFileSync(Config.paths.imageList));

function indexHandler(request, reply) {
	reply.view('base/index', {
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