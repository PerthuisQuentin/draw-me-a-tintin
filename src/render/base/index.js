"use strict";

const Joi = require('joi');

const Config = require('src/config.js');
const Log = require('src/logger.js');

function indexHandler(request, reply) {
	reply.view('base/index', {
        message: 'Hello World!'
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