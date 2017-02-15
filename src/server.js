"use strict";

// Load modules

const Hapi = require('hapi');
const Vision = require('vision');
const Inert = require('inert');

const Log = rootRequire('src/logger');
const Config = rootRequire('src/config').config;

const Setup = rootRequire('src/setup');



var server = new Hapi.Server();

module.exports = function() {
	server.connection({
		host: Config.server.host,
		port: Config.server.port
	});

	server.register([
		{
			register: Vision
		},
		{
			register: Inert
		}
	], err => {
		if (err) return Log.error("Server can't load a plugin :", err);

		server.register({
			register: Setup

		}, err => {
			if (err) return Log.error("Server can't setup views and routes:", err);

			server.start(err => {
				if (err) return Log.error("Server didn't start:", err);

				Log.info('Server listening on port ' + Config.server.port);
			});
		})
	});
};